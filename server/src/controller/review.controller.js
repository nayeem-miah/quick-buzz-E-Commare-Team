const { ReviewCollection, OrderCollection, OrderItemCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");
const { ObjectId } = require("mongodb");
const { OrderStatus } = require("../constants/enums");

const createReview = catchAsync(async (req, res) => {
    const review = req.body;

    // Set properties securely
    review.email = req.user.email;
    review.isVerifiedPurchase = true;
    review.createdAt = new Date().toISOString();
    
    if (review.review) {
        review.comment = review.review;
    }

    const result = await ReviewCollection.insertOne(review);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Review done",
        data: result
    });
});

const getSingleReview = catchAsync(async (req, res) => {
    const productid = req.params.id;

    const query = { productid };
    const result = await ReviewCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review get success",
        data: result
    });
});

const getAllReview = catchAsync(async (req, res) => {
    const result = await ReviewCollection.find().toArray();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review get success",
        data: result
    });
});

const checkEligibility = catchAsync(async (req, res) => {
    const email = req.user?.email;
    const { productId } = req.params;

    if (!email) {
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data: { isEligible: false, reason: "Login to Review" }
        });
    }

    // 1. Check if already reviewed
    let existingQuery = { email, productid: productId };
    if (ObjectId.isValid(productId)) {
        existingQuery = {
            email,
            $or: [
                { productid: productId },
                { productid: new ObjectId(productId) }
            ]
        };
    }
    const existingReview = await ReviewCollection.findOne(existingQuery);
    if (existingReview) {
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data: { isEligible: false, reason: "You have already reviewed this product", alreadyReviewed: true }
        });
    }

    // 2. Check if purchased
    const userOrders = await OrderCollection.find({
        email,
        status: { $ne: OrderStatus.CANCELLED }
    }).toArray();

    if (!userOrders.length) {
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data: { isEligible: false, reason: "Purchase this product to leave a review" }
        });
    }

    const orderIds = userOrders.map(order => order._id);
    const query = {
        order_id: { $in: orderIds },
        $or: [
            { product_id: productId }
        ]
    };
    if (ObjectId.isValid(productId)) {
        query.$or.push({ product_id: new ObjectId(productId) });
    }

    const purchaseRecord = await OrderItemCollection.findOne(query);
    if (!purchaseRecord) {
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data: { isEligible: false, reason: "Purchase this product to leave a review" }
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        data: { isEligible: true, reason: "" }
    });
});

const ReviewController = {
    createReview,
    getAllReview,
    getSingleReview,
    checkEligibility
};

module.exports = ReviewController;