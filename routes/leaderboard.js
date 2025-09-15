import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const leaderboard = await User.aggregate([
            {
                $lookup: {
                    from: "sins",
                    localField: "_id",
                    foreignField: "user",
                    as: "sins"
                }
            },
            {
                $project: {
                    username: 1,
                    streak: 1,
                    sinCount: { $size: "$sins" },
                }
            },
            { $sort: { streak: -1, sinCount: 1 }},
            { $limit: 10 }
        ]);
        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;