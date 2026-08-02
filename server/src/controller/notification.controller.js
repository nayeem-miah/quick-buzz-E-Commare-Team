const { NotificationCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");
const AppError = require("../utils/AppError");
const { ObjectId } = require("mongodb");

const getNotifications = catchAsync(async (req, res) => {
    const email = req.user?.email;
    if (!email) {
        throw new AppError(401, "unauthorized access");
    }

    const result = await NotificationCollection.find({ recipientEmail: email })
        .sort({ createdAt: -1 })
        .toArray();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "notifications retrieved successfully",
        data: result
    });
});

const markAsRead = catchAsync(async (req, res) => {
    const id = req.params.id;
    const email = req.user?.email;
    if (!email) {
        throw new AppError(401, "unauthorized access");
    }

    const filter = { _id: new ObjectId(id) };
    const notification = await NotificationCollection.findOne(filter);

    if (!notification) {
        throw new AppError(404, "Notification not found");
    }

    if (notification.recipientEmail !== email) {
        throw new AppError(403, "forbidden access");
    }

    const result = await NotificationCollection.updateOne(
        filter,
        { $set: { isRead: true } }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "notification marked as read",
        data: result
    });
});

const markAllAsRead = catchAsync(async (req, res) => {
    const email = req.user?.email;
    if (!email) {
        throw new AppError(401, "unauthorized access");
    }

    const result = await NotificationCollection.updateMany(
        { recipientEmail: email, isRead: false },
        { $set: { isRead: true } }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "all notifications marked as read",
        data: result
    });
});

const deleteNotification = catchAsync(async (req, res) => {
    const id = req.params.id;
    const email = req.user?.email;
    if (!email) {
        throw new AppError(401, "unauthorized access");
    }

    const filter = { _id: new ObjectId(id) };
    const notification = await NotificationCollection.findOne(filter);

    if (!notification) {
        throw new AppError(404, "Notification not found");
    }

    if (notification.recipientEmail !== email) {
        throw new AppError(403, "forbidden access");
    }

    const result = await NotificationCollection.deleteOne(filter);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "notification deleted successfully",
        data: result
    });
});

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
