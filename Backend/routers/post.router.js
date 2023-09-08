import express from "express";
import { addComment, addPost, deletePost, getPosts, getUserPosts, likePost, unLikePost, updatePost } from "../controllers/post.controller";

const postsRouter = express.Router();

postsRouter.get("/get-posts", getPosts);
postsRouter.get('/get-posts/:user_id',getUserPosts)
postsRouter.post("/add-post", addPost);
postsRouter.put("/update-post/:posts_id", updatePost);
postsRouter.delete("/delete-post/:posts_id", deletePost);
postsRouter.post("/like-post/:posts_id",likePost)
postsRouter.post("/unlike-post/:posts_id",unLikePost)
postsRouter.post("/add-comment/:posts_id", addComment)

export default postsRouter;
