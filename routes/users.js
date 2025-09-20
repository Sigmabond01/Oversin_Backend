import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Sin } from "../models/Sin.js";
import { CalorieEntry } from "../models/CalorieEntry.js";
import mongoose from "mongoose";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
    try {

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const [user, sinCount, calorieSummary] = await Promise.all([
            User.findById(req.user.id).select("-password"),
            Sin.countDocuments({ user: req.user.id }),
            CalorieEntry.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(req.user.id),
                        createdAt: { $gte: startOfDay, $lt: endOfDay }
                    }
                },
                {
                    $group: {
                        _id: "$type",
                        totalCalories: { $sum: "$calories"}
                    }
                }
            ])
        ]);

        if(!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }

        const intake = calorieSummary.find(s => s._id === "intake")?.totalCalories || 0;
        const expenditure = calorieSummary.find(s => s._id === "expenditure")?.totalCalories || 0;

        const userProfile = {
            ...user.toObject(),
            sinCount,
            dailyIntake: intake,
            dailyExpenditure: expenditure,
            netCalories: intake - expenditure
        };
        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;