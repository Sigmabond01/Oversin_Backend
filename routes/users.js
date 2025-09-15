import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Sin } from "../models/Sin.js";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const [user, sinCount] = await Promise.all([
            User.findById(req.user.id).select("-password"),
            Sin.countDocuments({ user: req.user.id })
        ]);

        if(!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }

        const userProfile = {
            ...user.toObject(),
            sinCount
        };
        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;