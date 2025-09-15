import express from "express";
import connectDB from "./db.js";
import authRoutes from "./index.js";
import dotenv from "dotenv";
import cors from "cors";
import workoutRoutes from "./routes/workouts.js"
import sinRoutes from "./routes/sins.js"; 
import userRoutes from "./routes/users.js";
import leaderboardRoutes from "./routes/leaderboard.js"

dotenv.config();

const app = express();
await connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/sins", sinRoutes);
app.use("/users", userRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));