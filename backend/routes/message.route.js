import express from "express";

import authenticated from "../middlewares/authenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiver",
  authenticated,
  upload.single("image"),
  sendMessage
);
messageRouter.get("/get/:receiver", authenticated, getMessage);

export default messageRouter;
