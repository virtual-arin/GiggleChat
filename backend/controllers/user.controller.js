import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

//Current user
export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("An error occured while getting current user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedData = {
      name,
      email,
    };

    if (req.file) {
      updatedData.image = await uploadOnCloudinary(req.file.path);
    }
    let user = await User.findByIdAndUpdate(req.userId, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("An error occured while updating user profile: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get other users
export const getUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("An error occured while getting other users: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
