const { ProductCollection, PaymentCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb")


const getallProduct = catchAsync(async (req, res) => {

    const { category, page = 1, size = 20 } = req.query;

    let query = {};

    // Category filter
    if (category && category !== "all" && category !== "null") {
        query.category = category;
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    const skip = (pageNumber - 1) * pageSize;

    // Fetch records
    const products = await ProductCollection.find(query)
        .skip(skip)
        .limit(pageSize)
        .toArray();

    // Total count for pagination frontend
    const totalCount = await ProductCollection.countDocuments(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "Products fetched successfully",
        meta: {
            total: totalCount,
            page: pageNumber,
            size: pageSize,
            totalPages: Math.ceil(totalCount / pageSize)
        },
        data: products
    });
});

const addProduct = catchAsync(async (req, res) => {
    const newProduct = req.body;
    const result = await ProductCollection.insertOne(newProduct);

    res.json({
        statusCode: 201,
        success: true,
        message: "product added success",
        data: result
    })
});

const getSingleProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await ProductCollection.findOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "product get success",
        data: result
    })
});

const deleteProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await ProductCollection.deleteOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "product deleted success",
        data: result
    })
});


const recentProduct = catchAsync(async (req, res) => {
    const search = req.query.search || "";
    const query = {
        adminIsApproved: "approve",
        $or: [
            { productTitle: { $regex: search, $options: "i" } },
            { brandName: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
        ],
    };

    const result = await ProductCollection
        .find(query)
        .limit(20)
        .sort({ _id: -1 })
        .toArray();


    res.json({
        statusCode: 200,
        success: true,
        message: "recent product success",
        data: result
    })
});

const recommendedProduct = catchAsync(async (req, res) => {
    const filter = {
        adminIsApproved: "approve"
    }

    const result = await ProductCollection
        .find(filter)
        .limit(6)
        .sort({ _id: -1 })
        .toArray();


    res.json({
        statusCode: 200,
        success: true,
        message: "recommended product get success",
        data: result
    })
});

const hostProductByEmail = catchAsync(async (req, res) => {
    const email = req.params.email;
    const query = { hostEmail: email };
    const result = await ProductCollection.find(query).toArray();


    res.json({
        statusCode: 200,
        success: true,
        message: "product get success",
        data: result
    })
});

const updateProduct = catchAsync(async (req, res) => {
    const productData = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    const updatedDoc = {
        $set: {
            productTitle: productData.productTitle,
            brandName: productData.brandName,
            price: productData.price,
            discount: productData.discount,
            tags: productData.tags,
            category: productData.category,
            description: productData?.description,
            productImage: productData.productImage,
            hostEmail: productData?.hostEmail,
            hostName: productData?.hostName,
            hostPhoto: productData?.hostPhoto,
            adminIsApproved: productData.adminIsApproved,
        },
    };
    const result = await ProductCollection.updateOne(filter, updatedDoc);


    res.json({
        statusCode: 201,
        success: true,
        message: "product update success",
        data: result
    })
});

const hostManageProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            hostIsApproved: "approve",
        },
    };
    const result = await PaymentCollection.updateOne(filter, updatedDoc);


    res.json({
        statusCode: 201,
        success: true,
        message: "product manage success",
        data: result
    })
});


const adminManageProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            adminIsApproved: "approve",
        },
    };
    const result = await ProductCollection.updateOne(filter, updatedDoc);


    res.json({
        statusCode: 201,
        success: true,
        message: "product manage success",
        data: result
    })
});


const ProductController = {
    getallProduct,
    addProduct,
    deleteProduct,
    getSingleProduct,
    recentProduct,
    recommendedProduct,
    hostProductByEmail,
    updateProduct,
    hostManageProduct,
    adminManageProduct
};

module.exports = ProductController;