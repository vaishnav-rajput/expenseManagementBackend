const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receipt: {
        type: String,
    }
})

module.exports = mongoose.model("Expense", expenseSchema)
