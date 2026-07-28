const { Router } = require("express");
const CartController = require("../controller/cart.controller");

const router = Router();

router.get("/:email", CartController.getUserCart);
router.post("/", CartController.addToCart);
router.patch("/:id", CartController.updateCartItemQuantity);
router.delete("/:id", CartController.removeFromCart);
router.delete("/clear/:email", CartController.clearUserCart);

const CartRoutes = router;
module.exports = CartRoutes;