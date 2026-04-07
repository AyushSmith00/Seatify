import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser= async (req, res) => {
    try {
        const {username, email, password, role} = req.body
    
        if (!username|| !email || !password || !role){
            return res.status(400).json({
                message: "All the field are required"
            })
        }
    
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
    
        if(existingUser){
            return res.status(400).json({
                message: "user with same email exists"
            });
        };
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
            },
        });
    
    
    
        res.status(201).json({
            message: "successfully registered",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error("register Error", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const loginUser = async(req, res) => {

    try {

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All the fields are required"
            })
        };

        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        };

        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword){
            return res.status(400).json({
                success: false,
                message: "The password is incorrect"
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },

        });


    } catch (error) {
        console.error("Login Error", error)
        return res.status(500).json({
            success: false,
            message: "server Error"
        })
    }
}