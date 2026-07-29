const { ObjectId } = require('mongodb');
const { UserCollection } = require('../module/module');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/sendResponse');

const getUser = catchAsync(async (req, res) => {
    const users = await UserCollection.find().toArray();

    const usersWithTimestamp = users.map(user => {
        if (!user.timestamp && user._id) {
            try {
                user.timestamp = new ObjectId(user._id).getTimestamp().toISOString();
                UserCollection.updateOne({ _id: user._id }, { $set: { timestamp: user.timestamp } }).catch(err => 
                    console.error("Failed to update user timestamp:", err)
                );
            } catch (err) {
                user.timestamp = new Date().toISOString();
            }
        }
        return user;
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "user get success",
        data: usersWithTimestamp
    });
});

const getSingleUser = catchAsync(async (req, res) => {
    const { email } = req.params;
    const user = await UserCollection.findOne({ email });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "get single user success",
        data: user
    });
});

const createUser = catchAsync(async (req, res) => {
    const user = req.body;
    const query = { email: user.email };

    const existingUser = await UserCollection.findOne(query);

    if (existingUser) {
        throw new AppError(409, "user already exist");
    }

    // Set timestamp and default role
    user.timestamp = new Date().toISOString();
    if (!user.role) {
        user.role = 'user';
    }

    const result = await UserCollection.insertOne(user);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "user create success",
        data: result
    });
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

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "user updated success",
        data: result
    });
});

const updateUserStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    const filter = { _id: new ObjectId(id) };

    const updatedDoc = {
        $set: {
            status: status,
        },
    };

    const result = await UserCollection.updateOne(filter, updatedDoc);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "user status updated success",
        data: result
    });
});

const UserController = {
    getUser,
    getSingleUser,
    createUser,
    updateUsers,
    updateUserStatus
};

module.exports = UserController;
