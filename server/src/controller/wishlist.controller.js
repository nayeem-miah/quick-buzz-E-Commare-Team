const { WishlistCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb")

const createWishlist = catchAsync(async (req, res) => {
    const wishlist = req.body;
    delete wishlist._id;
    if (!wishlist || Object.keys(wishlist).length === 0) {
        return res.status(400).send({ error: "Invalid wishlist data." });
    }
    const result = await WishlistCollection.insertOne(wishlist);

    res.json({
        statusCode: 201,
        success: true,
        message: "Wishlist create success",
        data: result
    })
});

const getWishlist = catchAsync(async (req, res) => {
    const result = await WishlistCollection.find().toArray()

    res.json({
        statusCode: 200,
        success: true,
        message: "Wishlist get success",
        data: result
    })
});

const getMyWishlist = catchAsync(async (req, res) => {
    const email = req.params.email;
    let result
    if (email) {
        query = { email: email }
        result = await WishlistCollection.find(query).toArray();
    }

    res.json({
        statusCode: 200,
        success: true,
        message: "Wishlist get success",
        data: result
    })
});

const deleteWishlist = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
    }

    const query = { _id: new ObjectId(id) };

    const result = await WishlistCollection.deleteOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "Wishlist deleted success",
        data: result
    })
});

const WishListController = {
    createWishlist,
    getWishlist,
    getMyWishlist,
    deleteWishlist
};

module.exports = WishListController;