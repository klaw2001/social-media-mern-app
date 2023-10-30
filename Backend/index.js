import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import postsRouter from "./routers/post.router";
import { Server } from "socket.io";

const app = express();

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log("Your server running on http://localhost:" + PORT);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/" + process.env.DB_NAME)
  .then(() => console.log("Connected!"));

app.use("/users", userRouter);
app.use("/posts", postsRouter);

const io = new Server({
  cors:{
    origin:"http://localhost:3000"
  }
});

let onlineUsers = []

const addNewuser = (username,socketId) =>{
    !onlineUsers.some((user)=>user.username === username) &&
    onlineUsers.push({username,socketId})
}

const removeUser = (socketId) =>{
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

const getUser = (username) =>{
    return onlineUsers.find((user)=> user.username === username)
}

io.on("connection", (socket) => {

    socket.on('newUser',(username)=>{
        addNewuser(username,socket.id)
    })

  socket.on("disconnect", () => {
    removeUser(socket.id)
  });
});

io.listen(5000);
