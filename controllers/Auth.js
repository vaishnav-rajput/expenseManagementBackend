const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if(!name || !email || !password){
            return res.status(403).send({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists, please sign in"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            profileImage: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,

        })
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully"
        })
    } catch (error) {
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
    }
}

exports.login = async(req, res) => {
    try {
        const {email, password}  = req.body;
        

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: `Please fill up all the details`
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered please register "
            })
        }

        if(await bcrypt.compare(password, user.password)){
            token = jwt.sign(
                {
                    email: user.email,
                    id: user._id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            user.token = token;
            user.password = undefined;


            res.cookie("token", token, {
                expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
                httpOnly: true,
            })
            

            res.status(200).json({
                success: true,
                token,
                user,
                message: 'user login success'
            })

        } else {
            return res.status(401).json({
                success: false,
                message: "password is incorrect"
            })
        }

    } catch (error) {
        console.error(error);
		return res.status(500).json({
			success: false,
			message: `Login Failure `,
		});
    }
}

exports.logout = async(req,res) => {
    res.clearCookie('token', {
        path: '/',
        httpOnly: true
    })
    res.status(200).send("logged out and cleared the cookie")
}