import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";

export const protect = async(req, res, next) => {
    try {

        const token = req.cookies.accessToken;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing"
            })
        }

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await prisma.user.findUnique({
            where: {id: decode.id},
            select: {
                id: true,
                email: true,
                role:true,
            },
        });

        if (!user){
            return res.status(401).json({
                success: false,
                message: "user not found"
            });
        };

        req.user = user

        next();

    } catch (error) {
        console.error("Auth Middleware Error", error)
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired token"
        })
    }
}