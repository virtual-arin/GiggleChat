import express from "express";
import {
  getCurrentUser,
  getUsers,
  updateProfile,
} from "../controllers/user.controller.js";
import authenticated from "../middlewares/authenticated.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", authenticated, getCurrentUser);
userRouter.put(
  "/profile",
  authenticated,
  upload.single("image"),
  updateProfile
);
userRouter.get("/users", authenticated, getUsers);

export default userRouter;
