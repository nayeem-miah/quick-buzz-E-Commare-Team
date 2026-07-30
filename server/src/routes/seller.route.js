const express = require("express");
const SellerController = require("../controller/seller.controller");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/", verifyToken, verifyAdmin, SellerController.getAllSeller);
router.get("/:id", verifyToken, SellerController.getSingleSeller);
router.get("/single-seller/:email", verifyToken, SellerController.getSingleSellerByEmail);
router.patch("/:id", verifyToken, SellerController.updateSeller);
router.delete("/:id", verifyToken, SellerController.deleteSeller);
router.post("/", verifyToken, SellerController.createSeller);
router.patch("/decline-message/:id", verifyToken, verifyAdmin, SellerController.sellerDecline);
router.patch("/approve/:id", verifyToken, verifyAdmin, SellerController.approveSeller);



const SellerRoutes = router;

module.exports = SellerRoutes;
