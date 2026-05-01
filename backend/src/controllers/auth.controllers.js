import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from "../utils/generate.token.js"

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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.user.update({
            where: {id: user.id},
            data: {
                refreshToken: refreshToken,
            }
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 50 * 1000
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error("Login Error", error)
        return res.status(500).json({
            success: false,
            message: "server Error"
        })
    }
}

export const refreshAccessToken = async(req, res) => {
    try {
        const token =  req.cookies.refreshToken;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token not Found"
            })
        }
        

        const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        
        const user = await prisma.user.findUnique({
            where: {
                id: decode.id
            },
        });

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            })
        };

        if(user.refreshToken !== token){
            return res.status(401).json({
                success: false,
                message: "Invalid Token (Mismatch)"
            })
        }

        const newAccessToken =  generateAccessToken(user)

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })


    } catch (error) {
        console.error("Invalid or expired refresh token", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    };
};

export const logout = async(req, res) => {
    try {

        await prisma.user.update({
            where: {id: req.user.id},
            data: {
                refreshToken: null,
            }
        })

        res.clearCookie("refreshToken");
    
        return res.status(200).json({
            success: true,
            message: "Logout SuccessFully"
        });
    } catch (error) {
        console.error("Logout Error", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    };
} ;