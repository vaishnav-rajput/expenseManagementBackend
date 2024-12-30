const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoutes = require("./routes/User")
const expenseRoutes = require("./routes/Expense")
const {cloudinaryConnect} = require("./config/cloudinary")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
const dbConnect = require("./config/database")
const cookieParser = require("cookie-parser")
dotenv.config()


dbConnect()

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/'
    })
)
app.use(express.json())
app.use(cookieParser())

cloudinaryConnect()
app.use(cors(
    {
        origin: 'http://localhost:3000', 
         credentials: true,
    }
));

app.use("/", userRoutes, expenseRoutes)
// app.use(cors({
// }));


app.listen(4000, () => {
    console.log("server started at port no 4000")
})








