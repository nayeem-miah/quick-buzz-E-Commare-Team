const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notification.controller");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, notificationController.getNotifications);
router.patch("/:id/read", verifyToken, notificationController.markAsRead);
router.patch("/read-all", verifyToken, notificationController.markAllAsRead);
router.delete("/:id", verifyToken, notificationController.deleteNotification);

module.exports = router;
