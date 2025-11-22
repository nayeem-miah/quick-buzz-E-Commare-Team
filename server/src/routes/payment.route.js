const express = require("express");
const paymentController = require("../controller/payment.controller");
const router = express.Router();


router.get("/", paymentController.getAllPayment);
router.get("/:email", paymentController.getSinglePayment);
router.get("/host-payment-history/:email", paymentController.getPaymentByHostEmail);

router.post("/create-payment", paymentController.createPayment);
router.post("/success-payment", paymentController.successPayment);
router.post("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);


const paymentRoutes = router;

module.exports = paymentRoutes;
