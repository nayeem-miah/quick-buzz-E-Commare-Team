const express = require("express");
const UserController = require("../controller/user.controller");
const router = express.Router();

router.get("/", UserController.getUser);
router.delete("/:id", UserController.deleteUser);
router.get("/:email", UserController.getSingleUser);
router.post("/", UserController.createUser);
router.patch("/role/:id", UserController.updateUsers);



const userRoutes = router;

module.exports = userRoutes;
