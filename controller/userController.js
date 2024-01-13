import mongoose from "mongoose";
import {userSchema} from "../model/userModel.js";
import bcrypt from "bcrypt";

const UserModel = mongoose.model("Users", userSchema);

export default class UserController {
  async register(req, res) {
    try {
      const {username, email, password} = req.body;

      //Checks if the provided username already exists in the database
      const usernameCheck = await UserModel.findOne({username});
      if (usernameCheck)
        return res.json({msg: "Username already used", status: false});
      const emailCheck = await UserModel.findOne({email});
      if (emailCheck)
        return res.json({msg: "Email already used", status: false});

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        email,
        username,
        password: hashedPassword,
      });

      delete user.password;

      return res.json({
        msg: "User successfully registered",
        status: true,
        user,
      });
    } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
  }

  async login(req, res) {
    try {
      const {username, password} = req.body;
      const user = await UserModel.findOne({username});
      if (!user)
        return res.json({msg: "Incorrect Username or Password", status: false});

      //Compares the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({msg: "Incorrect Username or Password", status: false});

      //Deletes the password field from the user object to avoid exposing the hashed password in the response.
      delete user.password;

      return res.json({msg: "Logged in successfully", status: true, user});
    } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
  }

  async setAvatar(req, res) {
    try {
      //Extracts the userId from the request parameters
      const userId = req.params.id;

      //Extracts the avatarImage from the request body
      const avatarImage = req.body.image;

      //Finds a user by ID and updates the user's data in the database
      const userData = await UserModel.findByIdAndUpdate(userId, {
        isAvatarImageSet: true,
        avatarImage,
      });

      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
        msg: "Logged in successfully",
      });
    } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
  }

  async getAllUSers(req, res) {
    try {
      //Retrieves users from the database where the _id is not equal to the specified ID
      //Uses the select method to specify which fields to include in the result
      const users = await UserModel.find({_id: {$ne: req.params.id}}).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);

      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
  }
}
