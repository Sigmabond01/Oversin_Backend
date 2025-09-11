import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL;

async function connectDB() {
    try {
        if(!MONGO_URI) {
            throw new Error("db is not defined!");
        }
        await mongoose.connect(MONGO_URI);
        console.log("Connectd to db!");
    } catch (err) {
        console.error("DB connection error: ", err);
        process.exit(1);
    }
}

export default connectDB;
