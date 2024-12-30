const mongoose = require("mongoose"
)
require("dotenv").config()
const dbConnect = async() => {
    
        await mongoose.connect("mongodb://localhost:27017/expenseDatabase", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("db connection successfull"))
        .catch((error) => {
            console.log("db connection failed")
            console.error(error)
            process.exit(1)
        })
}

module.exports = dbConnect;