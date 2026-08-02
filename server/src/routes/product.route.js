const express = require("express");
const ProductController = require("../controller/product.controller");
const router = express.Router();

const { verifyToken, verifyAdmin, verifyHost } = require("../middleware/auth");

router.get("/", ProductController.getallProduct);
router.get("/recent-product", ProductController.recentProduct);
router.get("/recommended-for-you-product", ProductController.recommendedProduct);
router.get('/:id', ProductController.getSingleProduct);
router.post("/", verifyToken, verifyHost, ProductController.addProduct);
router.delete('/:id', verifyToken, ProductController.deleteProduct);

router.get("/host-product/:email", verifyToken, verifyHost, ProductController.hostProductByEmail)

router.patch("/:id", verifyToken, ProductController.updateProduct);
router.patch("/host-manage-product/:id", verifyToken, verifyHost, ProductController.hostManageProduct);
router.patch("/admin-product/:id", verifyToken, verifyAdmin, ProductController.adminManageProduct);



const ProductRoutes = router;

module.exports = ProductRoutes;
