const { ReviewCollection, OrderCollection, OrderItemCollection } = require("../module/module");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const { OrderStatus } = require("../constants/enums");

const checkReviewEligibility = catchAsync(async (req, res, next) => {
    const email = req.user?.email;
    const productId = req.body.productid || req.query.productId || req.params.productId;

    if (!email) {
        throw new AppError(401, "unauthorized access");
    }

    if (!productId) {
        throw new AppError(400, "Product ID is required");
    }

    let existingQuery = {
        email,
        productid: productId
    };

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
        throw new AppError(400, "You have already reviewed this product");
    }


    const userOrders = await OrderCollection.find({
        email,
        status: { $ne: OrderStatus.CANCELLED }
    }).toArray();

    if (!userOrders.length) {
        throw new AppError(403, "Purchase this product to leave a review");
    }

    const orderIds = userOrders.map(order => order._id);

    let hasPurchased = false;
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
    if (purchaseRecord) {
        hasPurchased = true;
    }

    if (!hasPurchased) {
        throw new AppError(403, "Purchase this product to leave a review");
    }

    next();
});

module.exports = {
    checkReviewEligibility
};
