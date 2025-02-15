import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Route configuration
import userRoute from './Routers/user.routes';

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Welcome to Artus!');
});

// User Endpoint's
app.use("/user", userRoute);

export default app;