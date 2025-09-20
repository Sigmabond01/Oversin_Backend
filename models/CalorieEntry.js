import mongoose from "mongoose";

const CalorieEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['intake', 'expenditure'],
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    calories: {
        type: Number,
        required: true,
        min: 1,
    },
}, {
    timestamps: true
});

export const CalorieEntry = mongoose.model('CalorieEntry', CalorieEntrySchema);