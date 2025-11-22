const { ReviewCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");

const createReview = catchAsync(async (req, res) => {
    const review = req.body;

    const result = await ReviewCollection.insertOne(review);

    res.json({
        statusCode: 201,
        success: true,
        message: "Review done",
        data: result
    })
})

const getSingleReview = catchAsync(async (req, res) => {
    const productid = req.params.id;

    const query = { productid };
    const result = await ReviewCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();

    res.json({
        statusCode: 200,
        success: true,
        message: "Review get success",
        data: result
    })
})

const getAllReview = catchAsync(async (req, res) => {

    const result = await ReviewCollection.find().toArray();

    res.json({
        statusCode: 200,
        success: true,
        message: "Review get success",
        data: result
    })
});


const ReviewController = {
    createReview,
    getAllReview,
    getSingleReview
};

module.exports = ReviewController;