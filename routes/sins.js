import { Router } from "express";
import {z} from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Sin } from "../models/Sin.js";
import { User } from "../models/User.js";

const router = Router();

const sinSchema = z.object({
    body: z.object({
        reason: z.string().min(1, "A sin requires a reason, weakling"),
        severity: z.number().int().min(1).max(5, "Severity must be between 1 and 5")
    }),
});

router.post("/", authMiddleware, validate(sinSchema), async (req, res) => {
    try {
        const {reason, severity} = req.body;

        const newSin = new Sin({
            user: req.user.id,
            reason,
            severity,
        });

        const sin = await newSin.save();
        await User.findByIdAndUpdate(req.user.id, {streak: 0});
        res.status(201).json(sin);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const sins = await Sin.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(sins);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;