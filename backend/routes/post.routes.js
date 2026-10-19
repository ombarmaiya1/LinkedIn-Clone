import express from "express";
import {
  CreatePostController,
  getAllPostsController,
  likePostController,
  commentPostController,
} from "../controller/post.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";


const postRouter = express.Router();

postRouter.post(
  "/create",
  authMiddleWare,
  upload.single("image"),
  CreatePostController,
);
postRouter.get("/get", authMiddleWare, getAllPostsController);
postRouter.post("/like/:postId", authMiddleWare, likePostController);
postRouter.post("/comment/:postId", authMiddleWare, commentPostController);

export default postRouter;