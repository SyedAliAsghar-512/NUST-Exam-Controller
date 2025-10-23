import catchAsyncErrors from "../backend/middlewares/catchAsyncErrors.js"
import User from "../backend/models/user.js"
import Settings from "../backend/models/setting.js"
import ErrorHandler from "../backend/utils/errorHandler.js"
import sendToken from "../backend/utils/sendToken.js";
import sendEmail from "../backend/utils/sendEmail.js"
import {getResetPasswordTemplate} from "../backend/utils/emailTemplates.js"
import crypto from "crypto"
import {delete_file, upload_file} from "../backend/utils/cloudinary.js"
import bcrypt from "bcryptjs"



//registeruser
export const registerUser = catchAsyncErrors(async (req, res , next) => {
const { name, email, password } = req.body;

 const user = await User.create({
    name,
    email,
    password,
});
sendToken(user, 200, res);
});

//loginuser
export const loginUser = catchAsyncErrors(async (req, res , next) => {
    const { email, password } = req.body;
    
if (!email || !password ) {
    return next (new ErrorHandler("Please Enter Login ID and Password",400))
}

const user = await User.findOne({ email }).select("+password");

if (!user ) {
    return next (new ErrorHandler("Invalid Login ID or Password",401))
}

const IsPasswordMatched = await User.findOne({email,password});

if (!IsPasswordMatched) {
    return next (new ErrorHandler("Invalid Login ID or Password",401))
}
sendToken(user, 200, res);
});

//logoutuser
export const logoutUser = catchAsyncErrors(async (req, res , next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        message: "logged-out"
    })
})

//upload user avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
     
    const avatarResponse = await upload_file(req.body.avatar, "shopholic/avatar")

    if (req?.user?.avatar?.url) {
        await delete_file(req?.user?.avatar?.public_id)
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    })

    res.status(200).json({
        user,
    })
})

//forgetpassworduser
export const forgetPassword = catchAsyncErrors(async (req, res , next) => {

const user = await User.findOne({ email: req.body.email });

if (!user ) {
    return next (new ErrorHandler("user not found with this email",404))
}

const resetToken = user.getResetPasswordToken();

//console.log("reset token (forgot)",resetToken)

await user.save();

const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`

const message = getResetPasswordTemplate(user?.name, resetUrl);

try {
   await sendEmail({
    email: user.email,
    subject: "Shopholic Password Recovery",
    message,
   })
   res.status(200).json({
    message: `email sent to: ${user.email}`
   })
}
catch (error) {
    user.resetPasswordToken =  undefined
    user.resetPasswordExpire = undefined

    await user.save()
    return next (new ErrorHandler(error?.message, 500))
}
});

//resetpassword
export const resetPassword = catchAsyncErrors(async (req, res , next) => {

    const token = req.params.token

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    //console.log("reset token (reset)",resetPasswordToken)
   
    const user = await User.findOne({
       resetPasswordToken,
       resetPasswordExpire: { $gt : Date.now() }
    })
    if (!user ) {
       return next (new ErrorHandler("Password reset token is invalid or has been expired",401))
   }
   if (req.body.password !== req.body.confirmPassword) {
       return next (new ErrorHandler("Password does not match",400))
   }
   user.password = req.body.password
   
   user.resetPasswordToken =  undefined
   user.resetPasswordExpire = undefined
   
   await user.save()
   
   sendToken(user, 200, res);
   })

//getuserinfo
   export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id)
    res.status(200).json({
        user,
    })
})

//Changepassword
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res) 

})

// Update user profile   =>   /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        gmail: req.body.gmail,
        phoneno: req.body.phoneno,
        address: req.body.address
    }
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true
    })

    res.status(200).json({
        success: true,
        user
    })
})

// Get all users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})


// Get user details 
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update user profile
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true
    })

    res.status(200).json({
        success: true
    })
})

// Delete user
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    if(user?.avatar?.public_id) {
        await delete_file(user?.avatar?.public_id)
    }

    await user.remove();

    res.status(200).json({
        success: true,
    })
})

export const access = catchAsyncErrors(async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = await Settings.create({ hasAccess: false }); // Default if not found
        }
        res.json({ hasAccess: settings.hasAccess });
      } catch (error) {
        res.status(500).json({ message: "Server Error" });
      }
})

export const changeAccess = catchAsyncErrors(async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = await Settings.create({ hasAccess: false });
        }
    
        settings.hasAccess = !settings.hasAccess; // Toggle value
        await settings.save();
    
        res.json({ message: "Global Access Updated", hasAccess: settings.hasAccess });
      } catch (error) {
        res.status(500).json({ message: "Server Error" });
      }
})