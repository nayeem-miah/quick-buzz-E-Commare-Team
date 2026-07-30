const { OrderCollection, OrderItemCollection, PaymentCollection, CartCollection, UserCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const axios = require("axios");
const sendResponse = require("../utils/sendResponse");
const { OrderStatus, PaymentStatus } = require("../constants/enums");
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require("../utils/sendMail");
const createNotification = require("../utils/createNotification");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;

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

    // If Cash on Delivery, clear cart and finish immediately
    if (payment_method === "Cash on Delivery") {
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

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    updateOrderStatus
};
