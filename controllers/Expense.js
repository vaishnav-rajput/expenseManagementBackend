const Expense = require("../models/Expense")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.createExpense = async(req, res) => {
    try {
        const userId = req.user.id;
        let{
            expenseName, 
            price,
            date,
        } = req.body

        const receiptImage = req.files?.receiptImage ;

        if(!expenseName|| !price || !date){
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            })
        }
        if(receiptImage){
        receiptUploaded = await uploadImageToCloudinary(
            receiptImage,
            "Expenses"
        )
        }

        const newExpense = await Expense.create({
            expenseName,
            price,
            date,
            user: userId,
            receipt: receiptUploaded.secure_url,
        })

       const user =  await User.findByIdAndUpdate(
            {
                _id: req.user.id
            },
            {
                $push: {
                    expenses: newExpense._id
                }
            },
            {new: true}
        )

        
        res.status(200).json({
            success: true,
            data: newExpense,
            message: "Expense added successfully"
        })

    } catch (error) {
        console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create expense",
			error: error.message,
		});
    }
}

exports.editExpense = async(req, res) => {
    try {
        const {expenseId} = req.body
        const updates = req.body
        const expense = await Expense.findById(expenseId)

        if(!expense){
            return res.status(404).json({error: "Expense not found"})
        }

        if(req.files){
            const receiptUpdated = req.files.receiptUpdate
            const receiptUploaded = await uploadImageToCloudinary(
                receiptUpdated,
                process.env.FOLDER_NAME
            )
            expense.receipt = receiptUploaded.secure_url
        }

        Object.keys(updates).forEach((key) => {
            expense[key] = updates[key]
        })
        await expense.save()

        res.json({
            success: true,
            message: "Expense updated successfully",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getUserExpenses = async(req, res) => {
    try {   
        const userId = req.user.id;
        const userOnly = await User.findById(userId)
        // const user = await User.findById(userId).populate("expenses");
        const populatedUser = await userOnly.populate(
            "expenses"
        )

        res.status(200).json({
            success: true,
            data: populatedUser
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user expenses",
            error: error.message,
        })
    }
}

exports.getLeaderboardUsers = async(req, res) => {
    try {
        const users = await User.find({}, "name profileImage").populate("expenses", "price");
        const highestExpenseUsers = users
                    .map((user) =>{
                        const totalExpense = user.expenses.reduce((sum,expense) => sum + expense.price, 0)
                        return {user, totalExpense};
                    })
                    .sort((a, b) => b.totalExpense - a.totalExpense)

            res.status(200).json({
                success: true,
                data: highestExpenseUsers
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users by expense",
            error: error.message,
        });
    }
}

exports.deleteExpense = async(req, res) => {
    try {
        const {expenseId} = req.body;
        const userId = req.user.id;
        if (!expenseId) {
            return res.status(400).json({ message: "Expense ID is required" });
          }
          
        await Expense.findByIdAndDelete(expenseId);

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {expenses: expenseId},
            },
            {new: true}
        )

        return res.status(200).json(
            {   
                success: true,
                message: "Expense deleted successfully"
            }
        )
    } catch (error) {
        console.error("error deleting expense", error)
        return res.status(500).json(
            {
                message: "Internal server error"
            }
        )
    }
}

exports.editProfile = async(req, res) => {
    try {
        const userId  = req.user.id;
        const {name} = req.body;
        
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        if(req.files){
            const imageUpdated = req.files.profilePic
            const imageUploaded = await uploadImageToCloudinary(
                imageUpdated,
                process.env.FOLDER_NAME
            )
            user.profileImage = imageUploaded.secure_url
        }

        if(name){
            user.name = name;
        }

        await user.save()

        res.json({
            success: true,
            message: "User updated successfully",
            user: user
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}