const { Router } = require("express");
const OrderController = require("../controller/order.controller");

const router = Router();

router.get("/user/:email", OrderController.getUserOrders);
router.get("/:id", OrderController.getOrderDetails);
router.post("/", OrderController.createOrder);
router.patch("/:id/status", OrderController.updateOrderStatus);

const OrderRoutes = router;
module.exports = OrderRoutes;