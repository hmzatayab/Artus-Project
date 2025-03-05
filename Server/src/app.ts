import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// import { locationMiddleware } from "./Middleware/locationMiddleware";

// Route configuration
import userRoute from "./Routers/user.routes";
import postRoute from "./Routers/post.routes";
import commentRoute from "./Routers/comment.routes";
import walletRoute from "./Routers/wallet.routes";
import adminRoute from "./Routers/Admin/admin.routes";
import auctionRoute from "./Routers/auction.routes";
import notificationRoute from "./Routers/notification.routes";
import cookieSession from "cookie-session";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
// app.use(locationMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(cookieSession({
  name: "session",
  keys: [process.env.SESSION_KEY1 as string, process.env.SESSION_KEY2 as string],
  maxAge: 24 * 60 * 60 * 1000,
  secure: false,
  httpOnly: true,
}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/Images", express.static(path.join(__dirname, "public/Images")));


app.get("/", (req, res) => {
  res.send("Welcome to Artus!");
});

// Endpoint's
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/wallet", walletRoute);
app.use("/admin", adminRoute);
app.use("/auction", auctionRoute);
app.use("/notification", notificationRoute);

export default app;
