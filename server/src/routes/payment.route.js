const express = require("express");
const paymentController = require("../controller/payment.controller");
const router = express.Router();


const { verifyToken, verifyAdmin, verifyHost } = require("../middleware/auth");

router.get("/", verifyToken, verifyAdmin, paymentController.getAllPayment);
router.get("/:email", verifyToken, paymentController.getSinglePayment);
router.get("/host-payment-history/:email", verifyToken, verifyHost, paymentController.getPaymentByHostEmail);

router.post("/create-payment", verifyToken, paymentController.createPayment);
router.post("/success-payment", paymentController.successPayment);
router.post("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);
router.patch("/:id/status", verifyToken, verifyAdmin, paymentController.updatePaymentStatus);


const paymentRoutes = router;

module.exports = paymentRoutes;
