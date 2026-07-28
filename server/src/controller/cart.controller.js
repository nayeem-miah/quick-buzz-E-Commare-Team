const { CartCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const sendResponse = require("../utils/sendResponse");

const addToCart = catchAsync(async (req, res) => {
    const { email, product_id, quantity } = req.body;
    if (!email || !product_id) {
        return res.status(400).json({ success: false, message: "Email and Product ID are required" });
    }

    const qty = parseInt(quantity) || 1;
    const prodObjectId = new ObjectId(product_id);

    const existing = await CartCollection.findOne({ email, product_id: prodObjectId });
    let result;

    if (existing) {
        result = await CartCollection.updateOne(
            { _id: existing._id },
            { $set: { quantity: existing.quantity + qty } }
        );
    } else {
        result = await CartCollection.insertOne({
            email,
            product_id: prodObjectId,
            quantity: qty
        });
    }

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Item added to cart successfully",
        data: result
    });
});

const updateCartItemQuantity = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Cart Item ID format" });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
        return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const result = await CartCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { quantity: qty } }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cart quantity updated successfully",
        data: result
    });
});

const removeFromCart = catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Cart Item ID format" });
    }

    const result = await CartCollection.deleteOne({ _id: new ObjectId(id) });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cart item deleted successfully",
        data: result
    });
});

const getUserCart = catchAsync(async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    const result = await CartCollection.aggregate([
        { $match: { email } },
        {
            $lookup: {
                from: "allProducts",
                localField: "product_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" }
    ]).toArray();

    const formatted = result.map(item => ({
        _id: item._id,
        product_id: item.product_id,
        email: item.email,
        quantity: item.quantity,
        productTitle: item.productDetails.productTitle,
        productImage: item.productDetails.productImage,
        brandName: item.productDetails.brandName,
        price: item.productDetails.price,
        discount: item.productDetails.discount,
        description: item.productDetails.description,
        hostEmail: item.productDetails.hostEmail
    }));

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cart items fetched successfully",
        data: formatted
    });
});

const clearUserCart = catchAsync(async (req, res) => {
    const { email } = req.params;
    const result = await CartCollection.deleteMany({ email });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cart cleared successfully",
        data: result
    });
});

module.exports = {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    getUserCart,
    clearUserCart
};
