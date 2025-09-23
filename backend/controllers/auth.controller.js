import bcrypt, { genSalt } from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../config/token.js";

//Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userNameExist = await User.findOne({ username });
    if (userNameExist) {
      return res.status(400).json({ message: "username not available!" });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "email already registered!" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must contain a minimum of 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    console.error("An error occured while signing up: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const correctPassWord = await bcrypt.compare(password, user.password);
    if (!correctPassWord) {
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("An error occured while logging in: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(201).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("An error occured while logging out: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
