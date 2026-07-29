const express = require("express");
const UserController = require("../controller/user.controller");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.get("/", verifyToken, verifyAdmin, UserController.getUser);
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser);
router.get("/:email", verifyToken, UserController.getSingleUser);
router.post("/", UserController.createUser);
router.patch("/role/:id", verifyToken, verifyAdmin, UserController.updateUsers);



const userRoutes = router;

module.exports = userRoutes;
