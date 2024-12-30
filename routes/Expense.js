const express = require("express")
const router = express.Router()
const {auth} = require("../middlewares/auth")


const {
    createExpense,
    editExpense,
    getUserExpenses,
    getLeaderboardUsers,
    deleteExpense,
    editProfile
} = require("../controllers/Expense")

router.post('/createExpense', auth, createExpense)
router.post('/editExpense', auth, editExpense)
router.get('/getExpenses', auth, getUserExpenses)
router.get('/getLeaderboardUsers', getLeaderboardUsers)
router.post('/deleteExpense', auth, deleteExpense)
router.post('/editProfile', auth, editProfile)

module.exports = router
