const { Router } = require("express");
const OrderController = require("../controller/order.controller");

const router = Router();

const { verifyToken, verifyAdmin, verifyHost } = require("../middleware/auth");

router.get("/user/:email", verifyToken, OrderController.getUserOrders);
router.get("/", verifyToken, verifyAdmin, OrderController.getAllOrders);
router.get("/:id", verifyToken, OrderController.getOrderDetails);
router.post("/", verifyToken, OrderController.createOrder);
router.patch("/:id/status", verifyToken, verifyAdmin, OrderController.updateOrderStatus);

// Secure multi-vendor order workflow routes
router.patch("/:id/approve", verifyToken, verifyHost, OrderController.approveOrder);
router.patch("/:id/ship", verifyToken, verifyHost, OrderController.shipOrder);
router.patch("/:id/deliver", verifyToken, verifyAdmin, OrderController.deliverOrder);
router.patch("/:id/cancel", verifyToken, OrderController.cancelOrder);
router.get("/:id/history", verifyToken, OrderController.getOrderHistory);

const OrderRoutes = router;
module.exports = OrderRoutes;