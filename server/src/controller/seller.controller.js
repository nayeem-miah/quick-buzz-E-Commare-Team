const { SellerCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb")

const getAllSeller = catchAsync(async (req, res) => {
    const result = await SellerCollection.find().toArray();

    res.json({
        statusCode: 200,
        success: true,
        message: "seller get success",
        data: result
    })
});

const getSingleSeller = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await SellerCollection.findOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "single seller get success",
        data: result
    })
});

const getSingleSellerByEmail = catchAsync(async (req, res) => {
    const email = req.params.email;
    const query = { sellerEmail: email };
    const result = await SellerCollection.findOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "single seller get success",
        data: result
    })
});

const deleteSeller = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await SellerCollection.deleteOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "seller delete success",
        data: result
    })
});

const updateSeller = catchAsync(async (req, res) => {
    const sellerData = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            sellerName: sellerData.sellerName,
            mobile: sellerData.mobile,
            other: sellerData.other,
            address: sellerData.address,
            reason: sellerData.reason,
            imageUrl: sellerData.imageUrl
        }
    }

    const result = await SellerCollection.updateOne(filter, updatedDoc);

    res.json({
        statusCode: 200,
        success: true,
        message: "seller update success",
        data: result
    })
});

const createSeller = catchAsync(async (req, res) => {
    const seller = req.body;
    const query = { sellerEmail: seller.sellerEmail };
    const existingUser = await SellerCollection.findOne(query);
    if (existingUser) {
        return res.send({
            message: "seller already exist",
            insertedId: null,
        });
    }
    const result = await SellerCollection.insertOne(seller);

    res.json({
        statusCode: 200,
        success: true,
        message: "seller update success",
        data: result
    })
});


const sellerDecline = catchAsync(async (req, res) => {
    const declineMessage = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }

    const updatedDoc = {
        $set: {
            decline: declineMessage.inputValue
        }
    }
    const result = await SellerCollection.updateOne(filter, updatedDoc)

    res.json({
        statusCode: 201,
        success: true,
        message: "seller decline message success",
        data: result
    })
});



const SellerController = {
    getAllSeller,
    getSingleSeller,
    getSingleSellerByEmail,
    deleteSeller,
    updateSeller,
    createSeller,
    sellerDecline
}

module.exports = SellerController