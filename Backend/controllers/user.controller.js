import userModel from "../models/user.model";
import multer from "multer";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subFolder = "users";

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

export const getUsers = async (req, res) => {
  try {
    const userData = await userModel.find();
    if (userData) {
      return res.status(200).json({
        data: userData,
        msg: "Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const user = await userModel.findOne({ _id: userID });
    if (user) {
      return res.status(200).json({
        data: user,
        msg: "Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const addUser = (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userData = new userModel({
      username: username,
      email: email,
      password: hashedPassword,
      gender: gender,
    });
    userData.save();
    if (userData) {
      return res.status(201).json({
        data: userData,
        msg: "Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const uploadData = upload.single("profilepicture");
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ msg: err.msg });

      const userID = req.params.user_id;
      const {
        username,
        email,
        password,
        profilepicture,
        gender,
        firstname,
        lastname,
        bio,
      } = req.body;

      const userData = await userModel.findOne({ _id: userID });
      let pfp = userData.profilepicture;

      if (req.file !== undefined) {
        pfp = req.file.filename;
        if (fs.existsSync("./uploads/users" + pfp)) {
          fs.unlinkSync("./uploads/users" + pfp);
        }
      }
      let hashedPassword = userData.password;
      if (password) {
        hashedPassword = bcrypt.hashSync(password, 10);
      }
      const updatedData = await userModel.updateOne(
        { _id: userID },
        {
          $set: {
            username: username,
            email: email,
            password: hashedPassword,
            profilepicture: pfp,
            gender: gender,
            firstname: firstname,
            lastname: lastname,
            bio: bio,
          },
        }
      );
      if (updatedData.acknowledged) {
        return res.status(200).json({
          message: "Updated",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const userData = await userModel.findOne({ _id: userID });

    if (fs.existsSync("./uploads/users/" + userData.profilepicture)) {
      fs.unlinkSync("./uploads/users/" + userData.profilepicture);
    }

    const removeUser = await userModel.deleteOne(userData);
    if (removeUser.acknowledged) {
      return res.status(200).json({
        message: "Updated",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({
        msg: "User Already Exists.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userData = new userModel({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      username: username,
    });
    userData.save();
    if (userData) {
      return res.status(201).json({
        data: userData,
        success: true,
        message: "Successfully Registered",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await userModel.findOne({ email: email });
    if (!existUser) {
      return res.status(400).json({
        message: "User Does Not Exists!",
      });
    }
    const passwordCompare = await bcrypt.compare(password, existUser.password);
    if (!passwordCompare) {
      return res.status(400).json({
        message: "Invalid Credientials!",
      });
    }

    const token = jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
      },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      data: existUser,
      token: token,
      success: true,
      msg: "Login Successfull!",
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = req.params.user_id;
    const { userID } = req.body;
    const currentUser = await userModel.findById(userID);

    if (!currentUser.following.includes(userToFollow)) {
      const updatedCurrentUser = await userModel.findByIdAndUpdate(userID, {
        $push: {
          following: userToFollow,
        },
      });

      const updatedUserToFollow = await userModel.findByIdAndUpdate(userToFollow, {
        $push: {
          followers: userID,
        },
      });

      console.log("Current user ID:", updatedCurrentUser._id);
      console.log("Following array:", updatedCurrentUser.following);
      console.log("User to follow ID:", userToFollow);

      if (updatedCurrentUser && updatedUserToFollow) {
        return res.status(200).json({
          msg: "Followed",
        });
      }
    } else {
      return res.status(403).json({
        msg: "You Already Follow this user",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};


export const unFollowUser = async (req, res) => {
  try {
    const userToUnfollow = req.params.user_id;
    const { userID } = req.body;
    const currentUser = await userModel.findById(userID);

    if (currentUser.following.includes(userToUnfollow)) {
      const updatedData = await userModel.updateOne(
        { _id: userToUnfollow },
        {
          $pull: {
            followers: userID,
          },
        }
      );
      await userModel.findByIdAndUpdate(userID, {
        $pull: {
          following: userToUnfollow,
        },
      });

      // const updatedUserToUnfollow = await userModel.findOneAndUpdate(
      //   { _id: userToUnfollow },
      //   {
      //     $pull: {
      //       followers: userID,
      //     },
      //   },
      //   { new: true }
      // );

      if (updatedData.acknowledged) {
        return res.status(200).json({
          msg: "unfollowed",
          data: updatedData,
        });
      }
    } else {
      return res.status(403).json({
        msg: "You Dont Follow this user",
      });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error.msg,
    });
  }
};
