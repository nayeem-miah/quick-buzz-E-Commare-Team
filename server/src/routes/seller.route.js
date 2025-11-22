const express = require("express");
const SellerController = require("../controller/seller.controller");
const router = express.Router();

router.get("/", SellerController.getAllSeller);
router.get("/:id", SellerController.getSingleSeller);
router.get("/single-seller/:email", SellerController.getSingleSellerByEmail);
router.delete("/:id", SellerController.deleteSeller);
router.patch("/:id", SellerController.updateSeller);
router.post("/", SellerController.createSeller);
router.patch("/decline-message/:id", SellerController.sellerDecline)



const SellerRoutes = router;

module.exports = SellerRoutes;
