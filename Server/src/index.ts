import express from 'express';
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3000; // You can change this to any port you prefer

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello, tayyab!');
});

app.post("/register", async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password
        }
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "User registration failed" });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});