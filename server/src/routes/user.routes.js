const express = require("express");
const UserController = require("../controller/user.controller");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/", verifyToken, verifyAdmin, UserController.getUser);
router.get("/:email", verifyToken, UserController.getSingleUser);
router.post("/", UserController.createUser);
router.patch("/role/:id", verifyToken, verifyAdmin, UserController.updateUsers);
router.patch("/status/:id", verifyToken, verifyAdmin, UserController.updateUserStatus);
router.patch("/profile/:email", verifyToken, UserController.updateProfile);



const userRoutes = router;

module.exports = userRoutes;
