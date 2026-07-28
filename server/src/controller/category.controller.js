const { CategoryCollection, ProductCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const sendResponse = require("../utils/sendResponse");

const getAllCategories = catchAsync(async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search && search !== "null") {
        query.name = { $regex: search, $options: "i" };
    }

    const categories = await CategoryCollection.aggregate([
        { $match: query },
        {
            $lookup: {
                from: "allProducts",
                localField: "name",
                foreignField: "category",
                as: "products"
            }
        },
        {
            $addFields: {
                totalProducts: { $size: "$products" }
            }
        },
        { $project: { products: 0 } },
        { $sort: { _id: -1 } }
    ]).toArray();


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories fetched successfully",
        data: categories
    });
});

const createCategory = catchAsync(async (req, res) => {
    const { name, icon, description } = req.body;

    if (!name) {
        return sendResponse(res, { statusCode: 400, success: false, message: "Category name is required" });
    }

    const existing = await CategoryCollection.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
        return sendResponse(res, { statusCode: 400, success: false, message: "Category already exists" });
    }

    const newCategory = { name, icon: icon || "", description: description || "" };
    const result = await CategoryCollection.insertOne(newCategory);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: result
    });
});

const updateCategory = catchAsync(async (req, res) => {
    const id = req.params.id;
    const { name, icon, description } = req.body;

    if (!name) {
        return sendResponse(res, { statusCode: 400, success: false, message: "Category name is required" });
    }


    const existing = await CategoryCollection.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: new ObjectId(id) }
    });

    if (existing) {
        return sendResponse(res, { statusCode: 400, success: false, message: "Another category with this name already exists" });
    }


    const oldCategory = await CategoryCollection.findOne({ _id: new ObjectId(id) });
    if (oldCategory && oldCategory.name !== name) {
        await ProductCollection.updateMany(
            { category: oldCategory.name },
            { $set: { category: name } }
        );
    }

    const result = await CategoryCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, icon, description } }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: result
    });
});

const deleteCategory = catchAsync(async (req, res) => {
    const id = req.params.id;

    const category = await CategoryCollection.findOne({ _id: new ObjectId(id) });
    if (!category) {
        return sendResponse(res, { statusCode: 404, success: false, message: "Category not found" });
    }

    const productUsingCategory = await ProductCollection.findOne({ category: category.name });

    if (productUsingCategory) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "This category has products. Please move or delete the products first."
        });
    }

    const result = await CategoryCollection.deleteOne({ _id: new ObjectId(id) });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: result
    });
});

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
