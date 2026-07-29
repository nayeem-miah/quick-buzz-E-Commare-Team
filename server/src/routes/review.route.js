const { Router } = require("express");
const ReviewController = require("../controller/review.controller");

const router = Router();

const { verifyToken } = require("../middleware/auth");
const { checkReviewEligibility } = require("../middleware/review.middleware");

router.get("/", ReviewController.getAllReview);
router.get("/:id", ReviewController.getSingleReview);
router.get("/eligibility/:productId", verifyToken, ReviewController.checkEligibility);
router.post("/", verifyToken, checkReviewEligibility, ReviewController.createReview);


const ReviewRoutes = router;
module.exports = ReviewRoutes;