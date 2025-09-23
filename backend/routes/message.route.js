import express from "express";

import authenticated from "../middlewares/authenticated.js";
import { sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.js";

const messageRouter = express.Router();

messageRouter.post("/send", authenticated, upload.single("image"), sendMessage);

export default messageRouter;
