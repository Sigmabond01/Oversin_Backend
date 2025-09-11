import express from "express";
import connectDB from "./db.js";
import authRoutes from "./index.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
await connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));