const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        expenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Expense"
            }
        ],
        profileImage: {
            type: String,
        },
        token: {
            type: String,
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", userSchema)