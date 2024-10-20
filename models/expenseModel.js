import mongoose from "mongoose";

const schema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    participants: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            amount_owed: {
                type: Number,
                required: true,
            },
            percentage: {
                type: Number,
                default: null
            }
        },
    ],
    splitType: {
        type: String,
        enum: ['equal', 'exact', 'percentage'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const Expense = mongoose.model('Expense', schema)