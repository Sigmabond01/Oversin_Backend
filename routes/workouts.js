import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Workout } from "../models/Workout.js";
import { User } from "../models/User.js";
import { Router } from "express";
import { z } from "zod";

const router = Router();

const workoutSchema = z.object({
    body: z.object({
    type: z.string().min(1, "Type is required"),
    description: z.string().min(1, "Descrption is required"),
    duration: z.number().int().positive("Duration must be positive"),
}),
});

router.post("/", authMiddleware, validate(workoutSchema), async (req, res) => {
    try {
        const { type, description, duration} = req.body;

        const newWorkout = new Workout({
            user: req.user.id,
            type,
            description,
            duration,
        });

        const workout = await newWorkout.save();

        await User.findByIdAndUpdate(req.user.id, { $inc: { streak: 1 } });
        res.status(201).json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


router.get("/", authMiddleware, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;