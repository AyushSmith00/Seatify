export const authorizeRoles = (...allowedroles) => {
    return (req, res, next) => {
        try {
            if(!req.user){
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized, user not found"
                })
            }

            if(!allowedroles.includes(req.user.role)){
                return res.status(403).json({
                    success: false,
                    message: "Access denied: insufficient permissions"
                })
            }

            next();


        } catch (error) {
            console.error("Role Middleware Error", error)
            res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    };
}