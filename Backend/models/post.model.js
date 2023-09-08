import mongoose from "mongoose";
import userModel from "./user.model";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: userModel,
    },
    contentType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    textContent: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: null,
    },
    likes: {
      
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
