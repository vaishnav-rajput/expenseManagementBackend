const express = require("express")
const router = express.Router()

const {
    login,
    signup,
    logout
} = require("../controllers/Auth")

router.post("/login", login)
router.post("/signup", signup)
router.get("/logout", logout)


module.exports = router