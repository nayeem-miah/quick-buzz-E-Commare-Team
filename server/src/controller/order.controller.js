const { OrderCollection, OrderItemCollection, PaymentCollection, CartCollection, UserCollection, HostWalletCollection, OrderStatusHistoryCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const axios = require("axios");
const sendResponse = require("../utils/sendResponse");
const { OrderStatus, PaymentStatus, PaymentMethod, ApprovalStatus } = require("../constants/enums");
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require("../utils/sendMail");
const createNotification = require("../utils/createNotification");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const AppError = require("../utils/AppError");

// Create Order
const createOrder = catchAsync(async (req, res) => {
    const { email, items, total_amount, shipping_address, payment_method } = req.body;

    if (!email || !items || !items.length || !total_amount || !shipping_address) {
        return res.status(400).json({ success: false, message: "Missing required order fields" });
    }

    const trxId = new ObjectId().toString();

    // 1. Create the Order
    const orderData = {
        email,
        total_amount: parseFloat(total_amount),
        status: OrderStatus.PENDING,
        shipping_address,
        payment_method,
        date: new Date().toISOString()
    };
    const orderResult = await OrderCollection.insertOne(orderData);
    const orderId = orderResult.insertedId;

    // 2. Save Order Items
    const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: new ObjectId(item.product_id),
        productTitle: item.productTitle,
        productImage: item.productImage,
        brandName: item.brandName,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price),
        discount: parseFloat(item.discount) || 0,
        hostEmail: item.hostEmail
    }));
    await OrderItemCollection.insertMany(orderItems);

    // 3. Save Payment Record
    const paymentData = {
        order_id: orderId,
        cus_name: shipping_address.name,
        cus_email: email,
        amount: parseFloat(total_amount),
        payment_method,
        status: PaymentStatus.PENDING,
        transaction_id: trxId,
        date: new Date().toISOString()
    };
    await PaymentCollection.insertOne(paymentData);


    if (payment_method === PaymentMethod.COD) {
        await CartCollection.deleteMany({ email });

        // Send order confirmation email
        sendOrderConfirmationEmail(
            email,
            shipping_address.name,
            orderId,
            parseFloat(total_amount),
            payment_method
        ).catch(err => console.error("Email send failed:", err));

        try {
            await createNotification(email, {
                title: "Order Placed Successfully! 🛍️",
                message: `Thank you! Your Cash on Delivery order has been placed. Order ID: ${orderId}, total amount: BDT ${total_amount}.`,
                type: "success",
                actionUrl: "/dashboard/my-orders"
            });
        } catch (err) {
            console.error("Failed to send notification to buyer:", err);
        }

        try {
            const uniqueHostEmails = [...new Set(orderItems.map(item => item.hostEmail).filter(Boolean))];
            for (const hostEmail of uniqueHostEmails) {
                const hostItems = orderItems.filter(item => item.hostEmail === hostEmail);
                const itemsSummary = hostItems.map(item => `${item.productTitle} (Qty: ${item.quantity})`).join(", ");
                await createNotification(hostEmail, {
                    title: "New Order Received (COD) 📦",
                    message: `You have received a new Cash on Delivery order for: ${itemsSummary} from ${shipping_address.name}.`,
                    type: "info",
                    actionUrl: "/dashboard"
                });
            }
        } catch (err) {
            console.error("Failed to send notifications to hosts:", err);
        }

        // 3. Notify admins
        try {
            const admins = await UserCollection.find({ role: "admin" }).toArray();
            for (const admin of admins) {
                if (admin.email) {
                    await createNotification(admin.email, {
                        title: "New Order Placed (COD) 🛒",
                        message: `A new Cash on Delivery order of BDT ${total_amount} has been placed by ${shipping_address.name} (Order ID: ${orderId}).`,
                        type: "info",
                        actionUrl: "/dashboard/manage-bookings"
                    });
                }
            }
        } catch (err) {
            console.error("Failed to send notifications to admins:", err);
        }

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Order placed successfully (Cash on Delivery)",
            data: { orderId, paymentUrl: null }
        });
    }

    const intentData = {
        store_id,
        store_passwd,
        total_amount: parseFloat(total_amount),
        currency: "USD",
        tran_id: trxId,
        success_url: "http://localhost:3000/api/v1/payments/success-payment",
        fail_url: "http://localhost:3000/api/v1/payments/fail",
        cancel_url: "http://localhost:3000/api/v1/payments/cancel",
        emi_option: 0,
        cus_name: shipping_address.name,
        cus_email: email,
        cus_add1: shipping_address.address,
        cus_city: shipping_address.city,
        cus_postcode: "1234",
        cus_country: "Bangladesh",
        cus_phone: shipping_address.phone,
        shipping_method: "NO",
        product_name: items.map(i => i.productTitle).join(", "),
        product_category: "General",
        product_brandName: items.map(i => i.brandName || "Unknown").join(", "),
        product_profile: "general",
    };

    try {
        const gatewayResponse = await axios({
            method: "POST",
            url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            data: intentData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Order initiated. Redirecting to payment gateway...",
            data: { orderId, paymentUrl: gatewayResponse.data.GatewayPageURL }
        });
    } catch (err) {
        console.error("Payment Gateway Initialization Failed", err);
        res.status(500).json({ success: false, message: "Failed to initialize payment gateway" });
    }
});

// Get user orders
const getUserOrders = catchAsync(async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ success: false, message: "User email is required" });
    }

    const result = await OrderCollection.find({ email }).sort({ date: -1 }).toArray();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User orders fetched successfully",
        data: result
    });
});

// Get single order details with items
const getOrderDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }

    const order = await OrderCollection.findOne({ _id: new ObjectId(id) });
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    const items = await OrderItemCollection.find({ order_id: new ObjectId(id) }).toArray();
    const payment = await PaymentCollection.findOne({ order_id: new ObjectId(id) });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order details fetched successfully",
        data: {
            order,
            items,
            payment
        }
    });
});

// Update order status
const updateOrderStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }

    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const result = await OrderCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
    );

    // Fetch updated order details to send email and notification
    const order = await OrderCollection.findOne({ _id: new ObjectId(id) });
    if (order && order.email) {
        sendOrderStatusEmail(
            order.email,
            order.shipping_address?.name || "Customer",
            id,
            status
        ).catch(err => console.error("Email send failed:", err));

        // Dispatch in-app notification
        try {
            await createNotification(order.email, {
                title: "Order Status Updated 📦",
                message: `Your Order (ID: ${id}) status has been updated to "${status}".`,
                type: "info",
                actionUrl: "/dashboard/my-orders"
            });
        } catch (err) {
            console.error("Failed to send order status update notification:", err);
        }
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order status updated successfully",
        data: result
    });
});


const logStatusHistory = async ({ order_id, old_status, new_status, changed_by_user_id, changed_by_role }) => {
    await OrderStatusHistoryCollection.insertOne({
        order_id: new ObjectId(order_id),
        old_status,
        new_status,
        changed_by_user_id,
        changed_by_role,
        timestamp: new Date().toISOString()
    });
};

// Notify buyer, all hosts, and admins when an order status changes
const notifyOrderStatusChange = async ({ orderId, order, items, statusName, actorEmail }) => {
    try {
        // Notify buyer
        if (order?.email) {
            await createNotification(order.email, {
                title: `Order ${statusName} 📦`,
                message: `Your Order (ID: ${orderId}) has been ${statusName.toLowerCase()}.`,
                type: "info",
                actionUrl: "/dashboard/my-orders"
            });
        }

        // Notify all hosts involved in the order
        const hostEmails = [...new Set((items || []).map(item => item.hostEmail).filter(Boolean))];
        for (const hostEmail of hostEmails) {
            await createNotification(hostEmail, {
                title: `Order ${statusName} 📦`,
                message: `Order (ID: ${orderId}) has been ${statusName.toLowerCase()}.`,
                type: "info",
                actionUrl: "/dashboard/host-orders"
            });
        }

        // Notify all admins
        const admins = await UserCollection.find({ role: "admin" }).toArray();
        for (const admin of admins) {
            if (!admin.email) continue;
            await createNotification(admin.email, {
                title: `Order ${statusName} 📦`,
                message: `Order (ID: ${orderId}) has been ${statusName.toLowerCase()} by ${actorEmail || "system"}.`,
                type: "info",
                actionUrl: "/dashboard/manage-bookings"
            });
        }
    } catch (err) {
        console.error("Failed to send order status notifications:", err);
    }
};

const updateHostWallet = async (hostEmail, pendingChange, availableChange) => {
    await HostWalletCollection.updateOne(
        { hostEmail },
        {
            $setOnInsert: { pending_balance: 0, available_balance: 0 }
        },
        { upsert: true }
    );
    await HostWalletCollection.updateOne(
        { hostEmail },
        {
            $inc: {
                pending_balance: parseFloat(pendingChange) || 0,
                available_balance: parseFloat(availableChange) || 0
            }
        }
    );
};

const getItemTotal = (item) => {
    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.discount) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return price * (1 - discount / 100) * quantity;
};


const approveOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const hostEmail = req.user?.email;

    if (!ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid Order ID format");
    }

    const order = await OrderCollection.findOne({ _id: new ObjectId(id) });
    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.payment_method !== PaymentMethod.COD) {
        throw new AppError(400, "Only Cash on Delivery orders need approval");
    }

    const hostItems = await OrderItemCollection.find({
        order_id: new ObjectId(id),
        hostEmail: hostEmail
    }).toArray();

    if (hostItems.length === 0) {
        throw new AppError(403, "Forbidden: You do not own items in this order");
    }

    // Verify all host items are currently in 'pending' status (or undefined/null which defaults to pending)
    const invalidItems = hostItems.filter(item => item.status && item.status !== OrderStatus.PENDING);
    if (invalidItems.length > 0) {
        throw new AppError(400, "Invalid state transition: Some items are already approved or cancelled");
    }

    // Update status to processing
    await OrderItemCollection.updateMany(
        { order_id: new ObjectId(id), hostEmail: hostEmail },
        { $set: { status: OrderStatus.PROCESSING } }
    );

    // Calculate total price of host's approved items
    let hostTotal = 0;
    for (const item of hostItems) {
        hostTotal += getItemTotal(item);
        await logStatusHistory({
            order_id: id,
            old_status: item.status || OrderStatus.PENDING,
            new_status: OrderStatus.PROCESSING,
            changed_by_user_id: hostEmail,
            changed_by_role: req.user?.role || "host"
        });
    }

    // Add to host's pending balance
    await updateHostWallet(hostEmail, hostTotal, 0);

    // Update overall payment record hostIsApproved status
    await PaymentCollection.updateOne(
        { order_id: new ObjectId(id), hostEmail: hostEmail },
        { $set: { hostIsApproved: ApprovalStatus.APPROVED } }
    );

    // Check if all items in order are now processing/approved
    const allItems = await OrderItemCollection.find({ order_id: new ObjectId(id) }).toArray();
    const remainingPending = allItems.filter(item => (item.status || OrderStatus.PENDING) === OrderStatus.PENDING);
    if (remainingPending.length === 0) {
        await OrderCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: OrderStatus.PROCESSING } }
        );
    }

    await notifyOrderStatusChange({
        orderId: id,
        order,
        items: allItems,
        statusName: "Approved",
        actorEmail: hostEmail
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order items approved and moved to processing status successfully",
        data: { hostTotal }
    });
});


const shipOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { tracking_id } = req.body;
    const hostEmail = req.user?.email;

    if (!ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid Order ID format");
    }

    if (!tracking_id || typeof tracking_id !== "string" || tracking_id.trim() === "") {
        throw new AppError(400, "Tracking ID/courier info is mandatory to ship");
    }

    const hostItems = await OrderItemCollection.find({
        order_id: new ObjectId(id),
        hostEmail: hostEmail
    }).toArray();

    if (hostItems.length === 0) {
        throw new AppError(403, "Forbidden: You do not own items in this order");
    }


    const invalidItems = hostItems.filter(item => (item.status || OrderStatus.PENDING) !== OrderStatus.PROCESSING);
    if (invalidItems.length > 0) {
        throw new AppError(400, "Invalid state transition: Some items are not in processing status");
    }


    await OrderItemCollection.updateMany(
        { order_id: new ObjectId(id), hostEmail: hostEmail },
        {
            $set: {
                status: OrderStatus.SHIPPED,
                tracking_id: tracking_id.trim(),
                shipped_at: new Date().toISOString()
            }
        }
    );

    for (const item of hostItems) {
        await logStatusHistory({
            order_id: id,
            old_status: OrderStatus.PROCESSING,
            new_status: OrderStatus.SHIPPED,
            changed_by_user_id: hostEmail,
            changed_by_role: req.user?.role || "host"
        });
    }


    const allItems = await OrderItemCollection.find({ order_id: new ObjectId(id) }).toArray();
    const nonShipped = allItems.filter(item => (item.status || OrderStatus.PENDING) !== OrderStatus.SHIPPED && (item.status || OrderStatus.PENDING) !== OrderStatus.DELIVERED);
    if (nonShipped.length === 0) {
        await OrderCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: OrderStatus.SHIPPED } }
        );
    }

    const order = await OrderCollection.findOne({ _id: new ObjectId(id) });
    await notifyOrderStatusChange({
        orderId: id,
        order,
        items: allItems,
        statusName: "Shipped",
        actorEmail: hostEmail
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order items marked as shipped successfully",
        data: { tracking_id }
    });
});


const deliverOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { hostEmail } = req.body;

    if (!ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid Order ID format");
    }

    const query = { order_id: new ObjectId(id), status: OrderStatus.SHIPPED };
    if (hostEmail) {
        query.hostEmail = hostEmail;
    }

    const shippedItems = await OrderItemCollection.find(query).toArray();
    if (shippedItems.length === 0) {
        throw new AppError(400, "No shipped items found to deliver for this request");
    }


    await OrderItemCollection.updateMany(
        query,
        {
            $set: {
                status: OrderStatus.DELIVERED,
                delivered_at: new Date().toISOString()
            }
        }
    );


    const hostGroups = {};
    for (const item of shippedItems) {
        const email = item.hostEmail;
        const total = getItemTotal(item);
        hostGroups[email] = (hostGroups[email] || 0) + total;

        await logStatusHistory({
            order_id: id,
            old_status: OrderStatus.SHIPPED,
            new_status: OrderStatus.DELIVERED,
            changed_by_user_id: req.user?.email || "admin",
            changed_by_role: "admin"
        });
    }

    for (const [email, amount] of Object.entries(hostGroups)) {
        await updateHostWallet(email, -amount, amount);
    }
    const allItems = await OrderItemCollection.find({ order_id: new ObjectId(id) }).toArray();
    const nonDelivered = allItems.filter(item => (item.status || OrderStatus.PENDING) !== OrderStatus.DELIVERED);
    if (nonDelivered.length === 0) {
        await OrderCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: OrderStatus.DELIVERED } }
        );
    }

    const order = await OrderCollection.findOne({ _id: new ObjectId(id) });
    await notifyOrderStatusChange({
        orderId: id,
        order,
        items: allItems,
        statusName: "Delivered",
        actorEmail: req.user?.email || "admin"
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order items marked as delivered and escrow balances released successfully",
        data: { releasedBalances: hostGroups }
    });
});


const cancelOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userEmail = req.user?.email;
    const userRole = req.user?.role?.toLowerCase();

    if (!ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid Order ID format");
    }

    const isHost = userRole === "seller" || userRole === "host";
    const query = { order_id: new ObjectId(id) };
    if (isHost) {
        query.hostEmail = userEmail;
    }

    const targetItems = await OrderItemCollection.find(query).toArray();
    if (targetItems.length === 0) {
        throw new AppError(403, "Forbidden: No items found belonging to you in this order");
    }

    const invalidItems = targetItems.filter(item => {
        const s = item.status || OrderStatus.PENDING;
        return s === OrderStatus.SHIPPED || s === OrderStatus.DELIVERED || s === OrderStatus.CANCELLED;
    });

    if (invalidItems.length > 0) {
        throw new AppError(400, "Cancellation blocked: Some items are already shipped, delivered, or cancelled");
    }


    for (const item of targetItems) {
        const oldStatus = item.status || OrderStatus.PENDING;

        await OrderItemCollection.updateOne(
            { _id: item._id },
            { $set: { status: OrderStatus.CANCELLED } }
        );

        await logStatusHistory({
            order_id: id,
            old_status: oldStatus,
            new_status: OrderStatus.CANCELLED,
            changed_by_user_id: userEmail,
            changed_by_role: req.user?.role || "host"
        });

        if (oldStatus === OrderStatus.PROCESSING) {
            const amount = getItemTotal(item);
            await updateHostWallet(item.hostEmail, -amount, 0);
        }
    }


    const allItems = await OrderItemCollection.find({ order_id: new ObjectId(id) }).toArray();
    const nonCancelled = allItems.filter(item => (item.status || OrderStatus.PENDING) !== OrderStatus.CANCELLED);
    if (nonCancelled.length === 0) {
        await OrderCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: OrderStatus.CANCELLED } }
        );
    }

    const order = await OrderCollection.findOne({ _id: new ObjectId(id) });
    await notifyOrderStatusChange({
        orderId: id,
        order,
        items: allItems,
        statusName: "Cancelled",
        actorEmail: userEmail
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order items cancelled successfully"
    });
});


const getOrderHistory = catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid Order ID format");
    }

    const history = await OrderStatusHistoryCollection.find({
        order_id: new ObjectId(id)
    }).sort({ timestamp: 1 }).toArray();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order status history fetched successfully",
        data: history
    });
});

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    updateOrderStatus,
    approveOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    getOrderHistory,
    updateHostWallet,
    getItemTotal
};
