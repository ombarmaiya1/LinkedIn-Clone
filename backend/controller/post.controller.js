import Post from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { getIO } from "../config/socket.js";

const createPost = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description && !req.file) {
      return res
        .status(400)
        .json({ message: "Please provide description or image" });
    }

    let newPost;

    if (req.file) {
      try {
        const imageUrl = await uploadOnCloudinary(req.file.path);
        newPost = await Post.create({
          author: req.userId,
          description,
          image: imageUrl,
        });
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }

    const createdPost = await Post.findById(newPost._id)
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comments.author", "firstName lastName profileImage userName");

    const io = getIO();
    io?.emit("post:created", createdPost);

    res.status(201).json(createdPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPostsController = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName profileImage headline")
      .populate("comments.author", "firstName lastName profileImage userName")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findByIdAndUpdate(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    const io = getIO();
    io?.emit("post:liked", {
      postId: post._id.toString(),
      likes: post.likes.map((id) => id.toString()),
      likeCount: post.likes.length,
    });

    res.status(200).json({ isLiked: !isLiked, likeCount: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const commentPostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!comment?.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const newComment = {
      author: userId,
      content: comment.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "comments.author",
      "firstName lastName profileImage userName",
    );
    const createdComment =
      updatedPost.comments[updatedPost.comments.length - 1];

    const io = getIO();
    io?.emit("post:commented", {
      postId: postId.toString(),
      comment: createdComment,
    });

    res.status(200).json({ comment: createdComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createPost as CreatePostController,
  getAllPostsController,
  likePostController,
  commentPostController,
};
