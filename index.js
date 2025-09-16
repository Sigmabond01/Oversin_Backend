import { Router } from "express";
import { User } from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
import { validate } from "./middleware/validate.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many attempts! Please try again later!"
    }
})

const registerSchema = z.object({
    body: z.object({
        username: z.string().min(4, "Username must be atleast 4 characters!"),
        email: z.string().email("Invalid email address!"),
        password: z.string().min(6, "password must be atleast 6 characters!"),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address!"),
        password: z.string().min(6, "password must be atleast 6 characters!"),
    }),
});

router.post("/register", authLimiter, validate(registerSchema), async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {

        let existingUser = await User.findOne({email})
            if(existingUser){
                return res.status(409).json({
                    message: "Email already exists"
            })
        }

        existingUser = new User({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(password, salt);

        await existingUser.save();

        const payload = {
            existingUser: {
                id: existingUser.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "5h"},
            (err, token) => {
                if(err) throw err;
                res.status(201).json({
                    token
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/login", authLimiter, validate(loginSchema), async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(400).json({
            message: "Please enter your details"
        });
    }

    try {
        let existingUser = await User.findOne({ email });
        if(!existingUser) {
            return res.status(400).json({
                message: "Invalid credentials!"
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials!"
            });
        }

        const payload = { existingUser: { id: existingUser.id }};
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "5h"},
            (err, token) => {
                if(err) throw err;
                res.json({
                    token
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

export default router;