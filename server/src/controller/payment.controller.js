const { default: axios } = require("axios");
const { PaymentCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb")


const getAllPayment = catchAsync(async (req, res) => {
    const result = await PaymentCollection.find().toArray()

    res.json({
        statusCode: 20,
        success: true,
        message: "payment history find success",
        data: result
    })

});

const getPaymentByHostEmail = catchAsync(async (req, res) => {
    const hostEmail = req.params.email;
    const query = { hostEmail: hostEmail };
    const result = await PaymentCollection.find(query).toArray();

    res.json({
        statusCode: 201,
        success: true,
        message: "payment history find success",
        data: result
    })

});


const getSinglePayment = catchAsync(async (req, res) => {
    const email = req.params.email;
    const query = { cus_email: email, status: "success" };


    const result = await PaymentCollection.find(query).toArray();

    res.json({
        statusCode: 200,
        success: true,
        message: "single payment history find success",
        data: result
    })

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
        success_url: "hhttps://quick-bazz.vercel.app/api/v1/payments/success-payment",
        fail_url: "https://quick-bazz.vercel.app/api/v1/payments/fail",
        cancel_url: "https://quick-bazz.vercel.app/api/v1/payments/cancel",
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
        status: "pending",

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
    // update the database
    const query = {
        transactionId: successData.tran_id,
    };

    const update = {
        $set: {
            status: "success",
            tran_date: successData.tran_date,
            card_type: successData.card_type,
            hostIsApproved: "pending",
        },
    };
    await PaymentCollection.updateOne(
        query,
        update
    );

    // res.redirect("http://localhost:5173/success");
    res.redirect("https://quick-bus-bd.web.app/success");

});

const failPayment = catchAsync(async (req, res) => {
    res.redirect("https://quick-bus-bd.web.app/fail");
});

const cancelPayment = catchAsync(async (req, res) => {
    res.redirect("https://quick-bus-bd.web.app/cancel");

});





const paymentController = {
    getPaymentByHostEmail,
    getAllPayment,
    getSinglePayment,
    createPayment,
    successPayment,
    failPayment,
    cancelPayment
};

module.exports = paymentController;