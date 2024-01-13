import express from "express";
import MessageController from "../controller/messageController.js";

const messageRouter = express.Router();

const messageController = new MessageController();

messageRouter.post("/addmsg", (req, res) => {
  messageController.addMessage(req, res);
});

messageRouter.post("/getmsg", (req, res) => {
  messageController.getAllMessage(req, res);
});

export default messageRouter;
