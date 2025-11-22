const { ObjectId } = require('mongodb');
const { UserCollection } = require('../module/module')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const getUser = catchAsync(async (req, res) => {
    const users = await UserCollection.find().toArray();

    res.json({
        statusCode: 200,
        success: true,
        message: "user get success",
        data: users
    })
});

const deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await UserCollection.deleteOne(query);

    res.json({
        statusCode: 200,
        success: true,
        message: "user deleted success",
        data: result
    })
});

const getSingleUser = catchAsync(async (req, res) => {
    const { email } = req.params;
    const user = await UserCollection.findOne({ email });

    res.json({
        statusCode: 200,
        success: true,
        message: "get single user success",
        data: user
    })
});

const createUser = catchAsync(async (req, res) => {
    const user = req.body;
    const query = { email: user.email };

    const existingUser = await UserCollection.findOne(query);

    if (existingUser) {
        throw new AppError(409, "user already exist")
    }

    const result = await UserCollection.insertOne(user);
    console.log(result);

    res.json({
        statusCode: 201,
        success: true,
        message: "user create success",
        data: result
    })
});

const updateUsers = catchAsync(async (req, res) => {
    const { role } = req.body;
    const id = req.params.id;

    const filter = { _id: new ObjectId(id) };

    const updatedDoc = {
        $set: {
            role: role,
        },
    };

    const result = await UserCollection.updateOne(filter, updatedDoc);

    res.json({
        statusCode: 201,
        success: true,
        message: "user updated success",
        data: result
    })
});


const UserController = {
    getUser,
    deleteUser,
    getSingleUser,
    createUser,
    updateUsers
}

module.exports = UserController;
