const { Router } = require("express");
const OrderController = require("../controller/order.controller");

const router = Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/user/:email", verifyToken, OrderController.getUserOrders);
router.get("/:id", verifyToken, OrderController.getOrderDetails);
router.post("/", verifyToken, OrderController.createOrder);
router.patch("/:id/status", verifyToken, verifyAdmin, OrderController.updateOrderStatus);

const OrderRoutes = router;
module.exports = OrderRoutes;