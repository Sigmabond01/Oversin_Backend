import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    streak: {
  type: Number,
  default: 0
},
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);