import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { locationMiddleware } from "./Middleware/locationMiddleware";

// Route configuration
import userRoute from "./Routers/user.routes";
import postRoute from "./Routers/post.routes";

const app = express();

dotenv.config();
app.use(locationMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to Artus!");
});

// Endpoint's
app.use("/user", userRoute);
app.use("/post", postRoute);

export default app;
