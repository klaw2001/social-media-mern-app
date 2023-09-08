import express from "express";
import {
  getUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
  signUp,
  signIn,
  followUser,
  unFollowUser,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.get("/get-users", getUsers);
userRouter.get("/get-single-user/:user_id", getSingleUser);
userRouter.post("/add-user", addUser);
userRouter.put("/update-user/:user_id", updateUser);
userRouter.delete("/delete-user/:user_id", deleteUser);
userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
userRouter.put("/follow-user/:user_id", followUser);
userRouter.put("/unfollow-user/:user_id", unFollowUser);

export default userRouter;
