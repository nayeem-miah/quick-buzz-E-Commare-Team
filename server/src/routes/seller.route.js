const express = require("express");
const SellerController = require("../controller/seller.controller");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/", verifyToken, verifyAdmin, SellerController.getAllSeller);
router.get("/:id", verifyToken, SellerController.getSingleSeller);
router.get("/single-seller/:email", verifyToken, SellerController.getSingleSellerByEmail);
router.delete("/:id", verifyToken, verifyAdmin, SellerController.deleteSeller);
router.patch("/:id", verifyToken, verifyAdmin, SellerController.updateSeller);
router.post("/", verifyToken, SellerController.createSeller);
router.patch("/decline-message/:id", verifyToken, verifyAdmin, SellerController.sellerDecline);



const SellerRoutes = router;

module.exports = SellerRoutes;
