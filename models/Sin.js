import mongoose from "mongoose";

const SinSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    severity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 1,
    },
}, {
    timestamps: true
});

export const Sin = mongoose.model('Sin', SinSchema);