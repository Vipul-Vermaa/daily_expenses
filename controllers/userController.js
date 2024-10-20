import { User } from '../models/userModel.js'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/sendToken.js'

// user register
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password, mobile } = req.body
    if (!name || !email || !password || !mobile) return next(new ErrorHandler('Enter all fields', 400))
    let user = await User.findOne({ email })
    if (user) return next(new ErrorHandler('User already exist'), 409)
    user = await User.create({
        name, email, password, mobile
    })
    sendToken(res, user, "Registered Successfully", 201);
})

// user login
export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new ErrorHandler('Enter all fields', 400))
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new ErrorHandler('Incorrect Email or Password', 401))
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return next(new ErrorHandler('Incorrect Email or Password', 401))
    sendToken(res, user, "Logged in Successfully", 200);
})

// user details
export const userDetails = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if (!user) return next(new ErrorHandler('not found', 404))
    res.status(200).json({
        success: true,
        user
    })
})