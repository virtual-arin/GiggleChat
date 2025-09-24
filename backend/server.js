import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

const port = process.env.PORT || 404;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDatabase();
  console.log(`Server is listening to port ${port}`);
});
