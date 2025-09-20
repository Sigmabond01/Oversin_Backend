import express from "express";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import workoutRoutes from "./routes/workouts.js"
import sinRoutes from "./routes/sins.js"; 
import userRoutes from "./routes/users.js";
import leaderboardRoutes from "./routes/leaderboard.js"
import { logger } from "./middleware/logger.js";
import calorieRoutes from "./routes/calories.js"

dotenv.config();

const app = express();
await connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/nice", (req, res) => {
    res.status(200).json({ status: "ok", message: "API seems ok" })
});

app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/sins", sinRoutes);
app.use("/users", userRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/calories", calorieRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));