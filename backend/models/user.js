import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ' Please enter your name ' ],
        maxLength: [30, 'Your name cannot exceed 30 characters'],
    }, 
    email: {
        type: String,
        required: [true, ' Please enter your email '],
        unique: true,
    },
    password: {
        type: String,
        required: [true, ' Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    batch: {
        type: String
    },
    class: {
        type: String
    },
    avatar: {
        public_id:{
            type: String,
        },
        url: {
            type: String,
        }
            
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
},
{timestamps: true}
)

userSchema.methods.getJwtToken = function () {
    return Jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(10).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken
}

userSchema.methods.comparePassword = async function (enteredPassword) {;
     return validator.equals(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)
