import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js"
import ErrorHandler from "../utils/errorHandler.js";
import Jwt from "jsonwebtoken";

export const isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    const {token} = req.cookies; 

    if (!token) {
        return next (new ErrorHandler("Login first to access this area",401))
    }
    const decoded = Jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    next();
})

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next (new ErrorHandler("You are not allowed to access this resourse, you are not admin.", 403))
        }
        next();
    }
}