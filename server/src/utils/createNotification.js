const { NotificationCollection } = require("../module/module");

const createNotification = async (recipientEmail, { title, message, type = "info", actionUrl = "" } = {}) => {
    try {
        if (!recipientEmail || !title || !message) {
            console.error("Missing required notification details");
            return null;
        }

        const newNotification = {
            recipientEmail,
            title,
            message,
            type,
            isRead: false,
            createdAt: new Date(),
            actionUrl
        };

        const result = await NotificationCollection.insertOne(newNotification);
        return result;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};

module.exports = createNotification;
