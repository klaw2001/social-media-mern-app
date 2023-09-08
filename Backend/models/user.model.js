import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      default:null,
    },
    firstname:{
      type:String,
      default:null
    },
    bio:{
      type:String,
      default:null
    },
    lastname:{
      type:String,
      default:null
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilepicture: {
      type: String,
      default: null,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'other'],
        required: false
    },
  },
  { timestamps: true }
);

export default mongoose.model('User',UserSchema)