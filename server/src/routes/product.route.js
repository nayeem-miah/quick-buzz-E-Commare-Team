const express = require("express");
const ProductController = require("../controller/product.controller");
const router = express.Router();

router.get("/", ProductController.getallProduct);
router.get("/recent-product", ProductController.recentProduct);
router.get("/recommended-for-you-product", ProductController.recommendedProduct);
router.get('/:id', ProductController.getSingleProduct);
router.post("/", ProductController.addProduct);
router.delete('/:id', ProductController.deleteProduct);

router.get("/host-product/:email", ProductController.hostProductByEmail)

router.patch("/:id", ProductController.updateProduct);
router.patch("/host-manage-product/:id", ProductController.hostManageProduct);
router.patch("/admin-product/:id", ProductController.adminManageProduct);



const ProductRoutes = router;

module.exports = ProductRoutes;
