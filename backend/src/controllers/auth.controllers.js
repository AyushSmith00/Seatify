import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"

export const registerUser= async (req, res) => {
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
        res.status(400).json({
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
}