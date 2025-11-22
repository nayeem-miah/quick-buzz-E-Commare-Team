const { Router } = require("express");
const WishListController = require("../controller/wishlist.controller");

const router = Router();
router.get("/", WishListController.getWishlist);
router.get("/:email", WishListController.getMyWishlist);
router.post("/", WishListController.createWishlist);
router.delete("/:id", WishListController.deleteWishlist);



const WishListRoutes = router;

module.exports = WishListRoutes;