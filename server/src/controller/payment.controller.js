const { default: axios } = require("axios");
const { PaymentCollection, OrderCollection, CartCollection, UserCollection, OrderItemCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const sendResponse = require("../utils/sendResponse");
const { PaymentStatus, ApprovalStatus, OrderStatus } = require("../constants/enums");
const { sendOrderConfirmationEmail } = require("../utils/sendMail");
const createNotification = require("../utils/createNotification");

const getAllPayment = catchAsync(async (req, res) => {
    const result = await PaymentCollection.aggregate([
        { $sort: { _id: -1 } },
        {
            $lookup: {
                from: "order_items",
                localField: "order_id",
                foreignField: "order_id",
                as: "orderItems"
            }
        }
    ]).toArray();

    const formatted = result.map(payment => {
        const hasOrderItems = payment.orderItems && payment.orderItems.length > 0;
        return {
            _id: payment._id,
            order_id: payment.order_id,
            cus_name: payment.cus_name,
            cus_email: payment.cus_email,
            amount: payment.amount,
            totalPrice: payment.amount || payment.totalPrice,
            currency: payment.currency || "USD",
            payment_method: payment.payment_method || "Card",
            status: payment.status,
            transactionId: payment.transaction_id || payment.transactionId || "N/A",
            card_type: payment.card_type || "N/A",
            date: payment.date || payment.tran_date,
            tran_date: payment.tran_date || payment.date,
            hostIsApproved: payment.hostIsApproved || ApprovalStatus.PENDING,
            productTitle: hasOrderItems
                ? payment.orderItems.map(item => item.productTitle)
                : (payment.hostName || []),
            productImage: hasOrderItems
                ? payment.orderItems.map(item => item.productImage)
                : (payment.hostPhoto || []),
            brandName: hasOrderItems
                ? payment.orderItems.map(item => item.brandName || "Unknown")
                : (payment.brandName || []),
            hostEmail: hasOrderItems
                ? payment.orderItems.map(item => item.hostEmail || "N/A")
                : (payment.hostEmail || [])
        };
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "payment history find success",
        data: formatted
    });
});

const getPaymentByHostEmail = catchAsync(async (req, res) => {
    const hostEmail = req.params.email;

    const result = await PaymentCollection.aggregate([
        {
            $lookup: {
                from: "order_items",
                localField: "order_id",
                foreignField: "order_id",
                as: "orderItems"
            }
        },
        {
            $match: {
                $or: [
                    { hostEmail: hostEmail },
                    { "orderItems.hostEmail": hostEmail }
                ]
            }
        },
        { $sort: { _id: -1 } }
    ]).toArray();

    const formatted = result.map(payment => {
        const relevantItems = payment.orderItems
            ? payment.orderItems.filter(item => item.hostEmail === hostEmail)
            : [];
        const hasOrderItems = relevantItems.length > 0;
        const hostItemsTotal = relevantItems.reduce((sum, item) => sum + (item.price * (1 - (item.discount || 0) / 100) * item.quantity), 0);

        return {
            _id: payment._id,
            order_id: payment.order_id,
            cus_name: payment.cus_name,
            cus_email: payment.cus_email,
            amount: hasOrderItems ? hostItemsTotal : payment.amount,
            totalPrice: hasOrderItems ? hostItemsTotal : (payment.amount || payment.totalPrice),
            currency: payment.currency || "USD",
            payment_method: payment.payment_method || "Card",
            status: payment.status,
            transactionId: payment.transaction_id || payment.transactionId || "N/A",
            card_type: payment.card_type || "N/A",
            date: payment.date || payment.tran_date,
            tran_date: payment.tran_date || payment.date,
            hostIsApproved: payment.hostIsApproved || ApprovalStatus.PENDING,
            productTitle: hasOrderItems
                ? relevantItems.map(item => item.productTitle)
                : (payment.hostName || []),
            productImage: hasOrderItems
                ? relevantItems.map(item => item.productImage)
                : (payment.hostPhoto || []),
            brandName: hasOrderItems
                ? relevantItems.map(item => item.brandName || "Unknown")
                : (payment.brandName || []),
            hostEmail: hasOrderItems
                ? relevantItems.map(item => item.hostEmail || "N/A")
                : (payment.hostEmail || [])
        };
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "payment history find success",
        data: formatted
    });
});

const getSinglePayment = catchAsync(async (req, res) => {
    const email = req.params.email;
    const query = { cus_email: email };

    const result = await PaymentCollection.aggregate([
        { $match: query },
        { $sort: { _id: -1 } },
        {
            $lookup: {
                from: "order_items",
                localField: "order_id",
                foreignField: "order_id",
                as: "orderItems"
            }
        }
    ]).toArray();

    const formatted = result.map(payment => {
        const hasOrderItems = payment.orderItems && payment.orderItems.length > 0;
        return {
            _id: payment._id,
            order_id: payment.order_id,
            cus_name: payment.cus_name,
            cus_email: payment.cus_email,
            amount: payment.amount,
            totalPrice: payment.amount || payment.totalPrice,
            currency: payment.currency || "USD",
            payment_method: payment.payment_method || "Card",
            status: payment.status,
            transactionId: payment.transaction_id || payment.transactionId || "N/A",
            card_type: payment.card_type || "N/A",
            date: payment.date || payment.tran_date,
            tran_date: payment.tran_date || payment.date,
            hostIsApproved: payment.hostIsApproved || ApprovalStatus.PENDING,
            productTitle: hasOrderItems
                ? payment.orderItems.map(item => item.productTitle)
                : (payment.hostName || []),
            productImage: hasOrderItems
                ? payment.orderItems.map(item => item.productImage)
                : (payment.hostPhoto || []),
            brandName: hasOrderItems
                ? payment.orderItems.map(item => item.brandName || "Unknown")
                : (payment.brandName || []),
            hostEmail: hasOrderItems
                ? payment.orderItems.map(item => item.hostEmail || "N/A")
                : (payment.hostEmail || [])
        };
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "single payment history find success",
        data: formatted
    });
});


const date = new Date().toLocaleDateString();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;

const createPayment = catchAsync(async (req, res) => {
    const paymentInfo = req.body;
    const { totalPrice, email, displayName, multiProductTitle, multiProductBrandName, multiProductHostEmail, multiProductImg, multiProductDescription } = paymentInfo;

    // init data
    const trxId = new ObjectId().toString();



    const intentData = {
        store_id,
        store_passwd,
        total_amount: totalPrice,
        currency: paymentInfo?.currency || "USD",
        tran_id: trxId,
        success_url: "http://localhost:3000/api/v1/payments/success-payment",
        fail_url: "http://localhost:3000/api/v1/payments/fail",
        cancel_url: "http://localhost:3000/api/v1/payments/cancel",
        emi_option: 0,
        cus_name: displayName,
        cus_email: email,
        cus_add1: "Address Line 1",
        cus_city: "City",
        cus_postcode: "1234",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        shipping_method: "NO",
        product_name: multiProductTitle,
        product_category: "General",
        product_brandName: multiProductBrandName,
        product_profile: "general",
    };
    // post request
    const response = await axios({
        method: "POST",
        url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        data: intentData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    // console.log(response.data.GatewayPageURL, "response");
    // sava data in db
    const savaData = {
        cus_name: displayName,
        cus_email: email,
        productTitle: multiProductTitle,
        brandName: multiProductBrandName,
        productImage: multiProductImg,
        description: multiProductDescription,
        date: date,
        totalPrice: totalPrice,
        currency: "BDT",
        transactionId: trxId,
        hostEmail: multiProductHostEmail,
        status: PaymentStatus.PENDING,
    }
    const result = await PaymentCollection.insertOne(savaData)

    res.json({
        statusCode: 200,
        success: true,
        message: "single payment history find success",
        data: { paymentUrl: response.data.GatewayPageURL }
    })

});

const successPayment = catchAsync(async (req, res) => {
    const successData = req.body;

    if (successData.status !== "VALID") {
        throw new Error("unauthorize payment , invalid payment");
    }

    // Find the payment record matching transaction ID
    const paymentRecord = await PaymentCollection.findOne({
        $or: [
            { transaction_id: successData.tran_id },
            { transactionId: successData.tran_id }
        ]
    });

    if (paymentRecord) {
        // Update payment status
        await PaymentCollection.updateOne(
            { _id: paymentRecord._id },
            {
                $set: {
                    status: PaymentStatus.SUCCESS,
                    tran_date: successData.tran_date,
                    card_type: successData.card_type,
                }
            }
        );

        // Update order status
        if (paymentRecord.order_id) {
            await OrderCollection.updateOne(
                { _id: paymentRecord.order_id },
                { $set: { status: OrderStatus.PROCESSING } }
            );
        }

        // Clear user cart
        if (paymentRecord.cus_email) {
            await CartCollection.deleteMany({ email: paymentRecord.cus_email });
        }

        // Send order confirmation email
        sendOrderConfirmationEmail(
            paymentRecord.cus_email,
            paymentRecord.cus_name,
            paymentRecord.order_id,
            paymentRecord.amount || paymentRecord.totalPrice,
            paymentRecord.payment_method || "Card"
        ).catch(err => console.error("Email send failed:", err));

        try {
            await createNotification(paymentRecord.cus_email, {
                title: "Payment Successful! 💳",
                message: `Thank you! Your payment of BDT ${paymentRecord.amount || paymentRecord.totalPrice} for Order ID: ${paymentRecord.order_id} was successful.`,
                type: "success",
                actionUrl: "/dashboard/my-orders"
            });
        } catch (err) {
            console.error("Failed to send payment success notification to buyer:", err);
        }

        try {
            const orderIdObj = typeof paymentRecord.order_id === "string" ? new ObjectId(paymentRecord.order_id) : paymentRecord.order_id;
            const orderItems = await OrderItemCollection.find({ order_id: orderIdObj }).toArray();
            const uniqueHostEmails = [...new Set(orderItems.map(item => item.hostEmail).filter(Boolean))];
            for (const hostEmail of uniqueHostEmails) {
                const hostItems = orderItems.filter(item => item.hostEmail === hostEmail);
                const itemsSummary = hostItems.map(item => `${item.productTitle} (Qty: ${item.quantity})`).join(", ");
                await createNotification(hostEmail, {
                    title: "New Paid Order Received! 📦",
                    message: `You have received a new paid order for: ${itemsSummary} from ${paymentRecord.cus_name}.`,
                    type: "info",
                    actionUrl: "/dashboard"
                });
            }
        } catch (err) {
            console.error("Failed to send payment success notification to hosts:", err);
        }

        try {
            const admins = await UserCollection.find({ role: "admin" }).toArray();
            for (const admin of admins) {
                if (admin.email) {
                    await createNotification(admin.email, {
                        title: "New Payment Completed 💳",
                        message: `A payment of BDT ${paymentRecord.amount || paymentRecord.totalPrice} was completed by ${paymentRecord.cus_name} for Order ID: ${paymentRecord.order_id}.`,
                        type: "info",
                        actionUrl: "/dashboard/manage-bookings"
                    });
                }
            }
        } catch (err) {
            console.error("Failed to send payment success notification to admins:", err);
        }
    } else {
        await PaymentCollection.updateOne(
            { transactionId: successData.tran_id },
            {
                $set: {
                    status: PaymentStatus.SUCCESS,
                    tran_date: successData.tran_date,
                    card_type: successData.card_type,
                    hostIsApproved: ApprovalStatus.PENDING,
                }
            }
        );
    }

    res.redirect("http://localhost:5173/success");
});

const failPayment = catchAsync(async (req, res) => {
    res.redirect("http://localhost:5173/fail");
});

const cancelPayment = catchAsync(async (req, res) => {
    res.redirect("http://localhost:5173/cancel");

});





const updatePaymentStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Payment ID format" });
    }

    const payment = await PaymentCollection.findOne({ _id: new ObjectId(id) });
    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }

    // Update payment status
    const result = await PaymentCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, tran_date: new Date().toISOString() } }
    );

    // If updated to success, also update the linked order to processing
    if (status === PaymentStatus.SUCCESS && payment.order_id) {
        await OrderCollection.updateOne(
            { _id: new ObjectId(payment.order_id) },
            { $set: { status: OrderStatus.PROCESSING } }
        );
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment status updated successfully",
        data: result
    });
});

const paymentController = {
    getPaymentByHostEmail,
    getAllPayment,
    getSinglePayment,
    createPayment,
    successPayment,
    failPayment,
    cancelPayment,
    updatePaymentStatus
};

module.exports = paymentController;
