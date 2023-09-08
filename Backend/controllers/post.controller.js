import postModel from "../models/post.model";
import userModel from "../models/user.model";
import multer from "multer";
import fs from "fs";
import path from "path";
import { io } from "../index";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subFolder = "posts";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const subFolderPath = path.join(uploadPath, subFolder);
    if (!fs.existsSync(subFolderPath)) {
      fs.mkdirSync(subFolderPath);
    }

    cb(null, subFolderPath);
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    const ext = path.extname(name);
    const nameArr = name.split(".");
    nameArr.pop();
    const fname = nameArr.join(".");
    const fullname = fname + "-" + Date.now() + ext;
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

export const getPosts = async (req, res) => {
  try {
    const postsData = await postModel.aggregate([
      {
        $lookup: {
          from: "users", //dbname
          localField: "userID", //name stored in postsmodel
          foreignField: "_id", //by which to get is userID
          as: "users", //set a random name
        },
      },
      { $unwind: "$users" },
    ]);

    if (postsData) {
      return res.status(200).json({
        data: postsData,
        msg: "Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};
  
  export const getUserPosts = async (req, res) => {
    try {
      const userID = req.params.user_id;
      const userPosts = await postModel.find({ userID: userID });
       if (!userPosts) {
         return res.status(404).json({ message: "User's posts not found" });
       }
       return res.status(200).json({ data: userPosts });
     } catch (error) {
       return res.status(500).json({ message: "Internal server error" });
     }
    }
    

export const addPost = (req, res) => {
  try {
    const uploadPostImg = upload.single("image");
    uploadPostImg(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { userID, contentType, textContent, image, caption } = req.body;
      let newPost;
      if (contentType === "text") {
        newPost = new postModel({
          userID: userID,
          contentType: contentType,
          textContent: textContent,
        });
      } else if (contentType === "image") {
        let image = null;
        if (req.file !== undefined) {
          image = req.file.filename;
        }
        newPost = new postModel({
          userID: userID,
          contentType: contentType,
          image: image,
          caption: caption,
        });
      } else {
        return res.status(400).json({
          msg: 'Invalid content type. Must be "text" or "image".',
        });
      }
      const savedPost = await newPost.save();
      return res.status(201).json({
        data: savedPost,
        msg: "Post Added",
      });
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const uploadPostImg = upload.single("image");
    uploadPostImg(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const postID = req.params.posts_id;
      const { userID, contentType, textContent, image, caption } = req.body;
      const updatedFields = {};

      if (contentType == "text") {
        updatedFields.contentType = contentType;
        updatedFields.textContent = textContent;
        updatedFields.image = null;
        updatedFields.caption = null;
      } else if (contentType == "image") {
        updatedFields.contentType = contentType;
        updatedFields.textContent = null;
        updatedFields.caption = caption;
      } else {
        return res.status(400).json({
          msg: "Invalid Content Type",
        });
      }

      const updatedPost = await postModel.updateOne(
        { _id: postID },
        {
          $set: updatedFields,
        }
      );

      if (updatedPost.acknowledged) {
        return res.status(200).json({
          data: updatedPost,
          msg: "Post Updated",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postID = req.params.posts_id;
    const postData = await postModel.findOne({ _id: postID });

    if (fs.existsSync("./uploads/posts/" + postData.image)) {
      fs.unlinkSync("./uploads/posts/" + postData.image);
    }

    const deletePost = await postModel.deleteOne(postData);
    if (deletePost.acknowledged) {
      return res.status(200).json({
        msg: "Post deleted successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postID = req.params.posts_id;
    const { userID } = req.body;
    const postData = await postModel.findOne({ _id: postID });

    if (!postData) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    if (postData.likes.includes(userID)) {
      return res.status(400).json({
        msg: "You have already liked this post",
      });
    }
    // userData = await userModel.findOne({ _id: userID });
    const updatedData = await postModel
      .updateOne(
        { _id: postData },
        { $addToSet: { likes: userID } },
        { new: true }
      )
      .populate("Users");

    // if(updatedData){
    //   io.to(updatedData.userID).emit("postLiked",{
    //     msg:`${userID} liked your post`

    //   })
    // }

    return res.status(201).json({
      msg: "You Liked The Post",
      post: updatedData,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const unLikePost = async (req, res) => {
  try {
    const postID = req.params.posts_id;
    const { userID } = req.body;
    const postData = await postModel.findOne({ _id: postID });

    if (!postData) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    if (!postData.likes.includes(userID)) {
      return res.status(400).json({
        msg: "You have not like this post liked this post",
      });
    }

    const updatedData = await postModel.findByIdAndUpdate(
      postID,
      { $pull: { likes: userID } },
      { new: true }
    );

    if (updatedData) {
      return res.status(201).json({
        msg: "You unLiked The Post",
        post: updatedData,
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postID = req.params.posts_id;
    const { userID, comment } = req.body;

    const postsData = await postModel.findOne({ _id: postID });

    if (!postsData) {
      return res.status(404).json({
        msg: "Post Not Found",
      });
    }

    postsData.comments.push({ userID, comment });

    const updatedData = await postsData.save();

    if (updatedData) {
      return res.status(201).json({
        msg: "Comment Added",
        data: updatedData,
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};
