import express from "express";
import UserController from "../controller/userController.js";

const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/register", (req, res) => {
  userController.register(req, res);
});

userRouter.post("/login", (req, res) => {
  userController.login(req, res);
});

userRouter.post("/setAvatar/:id", (req, res) => {
  userController.setAvatar(req, res);
});

userRouter.get("/allusers/:id", (req, res) => {
  userController.getAllUSers(req, res);
});

export default userRouter;
