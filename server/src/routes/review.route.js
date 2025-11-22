const { Router } = require("express");
const ReviewController = require("../controller/review.controller");

const router = Router();

router.get("/", ReviewController.getAllReview)
router.get("/:id", ReviewController.getSingleReview)
router.post("/", ReviewController.createReview)


const ReviewRoutes = router;
module.exports = ReviewRoutes;