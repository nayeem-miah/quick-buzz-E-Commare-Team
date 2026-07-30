const { SellerCollection, UserCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const sendResponse = require("../utils/sendResponse");
const { sendSellerStatusEmail } = require("../utils/sendMail");
const AppError = require("../utils/AppError");

const getAllSeller = catchAsync(async (req, res) => {
    const result = await SellerCollection.find().toArray();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "seller get success",
        data: result
    });
});

const getSingleSeller = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await SellerCollection.findOne(query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "single seller get success",
        data: result
    });
});

const getSingleSellerByEmail = catchAsync(async (req, res) => {
    const email = req.params.email;
    const query = { sellerEmail: email };
    const result = await SellerCollection.findOne(query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "single seller get success",
        data: result
    });
});

const deleteSeller = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const sellerRequest = await SellerCollection.findOne(query);
    if (!sellerRequest) {
        throw new AppError(404, "Seller request not found");
    }

    if (req.user.role !== "admin" && sellerRequest.sellerEmail !== req.user.email) {
        throw new AppError(403, "You do not have permission to delete this request");
    }

    const result = await SellerCollection.deleteOne(query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "seller delete success",
        data: result
    });
});

const updateSeller = catchAsync(async (req, res) => {
    const sellerData = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    const sellerRequest = await SellerCollection.findOne(filter);
    if (!sellerRequest) {
        throw new AppError(404, "Seller request not found");
    }

    if (req.user.role !== "admin" && sellerRequest.sellerEmail !== req.user.email) {
        throw new AppError(403, "You do not have permission to update this request");
    }

    const updatedDoc = {
        $set: {
            sellerName: sellerData.sellerName,
            mobile: sellerData.mobile,
            other: sellerData.other,
            address: sellerData.address,
            reason: sellerData.reason,
            imageUrl: sellerData.imageUrl,
            adminIsApproved: "Pending",
            decline: ""
        }
    }

    const result = await SellerCollection.updateOne(filter, updatedDoc);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "seller update success",
        data: result
    });
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

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "seller update success",
        data: result
    });
});

const sellerDecline = catchAsync(async (req, res) => {
    const declineMessage = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }

    const sellerRequest = await SellerCollection.findOne(filter);
    if (!sellerRequest) {
        return res.status(404).send({ success: false, message: "Seller request not found" });
    }

    const updatedDoc = {
        $set: {
            adminIsApproved: "Declined",
            decline: declineMessage.inputValue
        }
    }
    const result = await SellerCollection.updateOne(filter, updatedDoc)

    // Send email
    await sendSellerStatusEmail(
        sellerRequest.sellerEmail,
        sellerRequest.sellerName,
        "Declined",
        declineMessage.inputValue
    );

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "seller decline message success",
        data: result
    });
});

const approveSeller = catchAsync(async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    const sellerRequest = await SellerCollection.findOne(filter);
    if (!sellerRequest) {
        return res.status(404).send({ success: false, message: "Seller request not found" });
    }


    const updatedDoc = {
        $set: {
            adminIsApproved: "Approved",
            decline: ""
        }
    };
    const result = await SellerCollection.updateOne(filter, updatedDoc);


    const userFilter = { email: sellerRequest.sellerEmail };
    const userUpdate = {
        $set: {
            role: "host"
        }
    };
    await UserCollection.updateOne(userFilter, userUpdate);

    await sendSellerStatusEmail(
        sellerRequest.sellerEmail,
        sellerRequest.sellerName,
        "Approved"
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "seller approved success",
        data: result
    });
});

const SellerController = {
    getAllSeller,
    getSingleSeller,
    getSingleSellerByEmail,
    deleteSeller,
    updateSeller,
    createSeller,
    sellerDecline,
    approveSeller
};

module.exports = SellerController;
