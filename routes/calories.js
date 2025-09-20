import { Router } from "express";
import { z} from "zod";
import { authMiddleware } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js";
import { CalorieEntry } from "../models/CalorieEntry.js";

const router = Router();

const calorieEntrySchema = z.object({
    body: z.object({
        type: z.enum(['intake', 'expenditure']),
        description: z.string().min(1, "Take a note, bro"),
        calories: z.number().int().positive("Calories must be positive")
    }),
});

router.post('/', authMiddleware, validate(calorieEntrySchema), async(req, res) => {
    try {
        const {type, description, calories} = req.body;
        const newEntry = new CalorieEntry({
            user: req.user.id,
            type,
            description,
            calories,
        });
        const entry = await newEntry.save();
        res.status(201).json(entry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const entries = await CalorieEntry.find({
            user: req.user.id,
            createdAt: { $gte: startOfDay, $lt: endOfDay},
        }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const entry = await CalorieEntry.findById(req.params.id);
        if(!entry) {
            return res.status(404).json({
                message: "entry not found"
            })
        }
        if(entry.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        await entry.deleteOne();
        res.json({
            message: "Deleted successfully"
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;