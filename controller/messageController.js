import mongoose from "mongoose";
import {messageSchema} from "../model/messageModel.js";

const MessageModel = mongoose.model("Messages", messageSchema);

export default class MessageController {
  async addMessage(req, res) {
    try {
      const {from, to, message} = req.body;

      const data = await MessageModel.create({
        message: {text: message}, // text field for the message content
        users: {from, to}, //users field for the sender and receiver IDs
        sender: from, //sender field indicating the sender's ID.
      });

      if (data) {
        return res.json({msg: "Message added successfully."});
      } else {
        return res.json({msg: "Failed to add message to the database"});
      }
    } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
  }

  async getAllMessage(req, res) {
    try {
      const {from, to} = req.body;

      //Retrieves messages from the db where the users array contains both 'from' and 'to' IDs.
      const messages = await MessageModel.find({
        users: {
          //Uses $all to match documents where the users array contains all specified elements
          $all: {from, to},
        },
      }).sort({updatedAt: 1}); //Sorts the messages based on the updatedAt field in ascending order.

      const projectedMessages = messages.map((msg) => {
        return {
          //Evaluates whether the sender of the current msg is equal to the value of the 'from' parameter.
          fromSelf: msg.sender.toString() === from, //checks if the string representation of the sender's ID is equal to the value of 'from'
          message: msg.message.text, //Extracts the text content of the message.
        };
      });

      res.send(projectedMessages);
    } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
  }
}
