import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {connectUsingMongoose} from "./config/mongooseConfig.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";

// Create an Express application
const app = express();

dotenv.config();

app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Define routes for authentication and messages
app.get("/", (req, res) => {
  res.send("welcome...");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(process.env.PORT || 6100, () => {
  connectUsingMongoose();
  console.log(`Server is listening on ${process.env.PORT}`);
});

// Create a new instance of Socket.IO and attach it to the server
const io = new Server(server, {
  cors: {
    credentials: true,
  },
});

// Create a global map to store online users
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  // Set the global chatSocket to the current socket
  global.chatSocket = socket;

  // Event handler for adding a user to the onlineUsers map
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Event handler for sending a message
  socket.on("send-msg", (data) => {
    // Retrieve the socket ID of the recipient user
    const sendUserSocket = onlineUsers.get(data.to);

    // If the recipient user is online, emit a "msg-receive" event to their socket
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
