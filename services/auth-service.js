const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken')



// @desc    Signup 
// @route   POST  /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
   console.log(req.body);
   // 1) create user 
   const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
   })
   // 2) generate token
   const token = generateToken(user._id)

   res.status(201).json({
      data: user,
      token
   })

})


// @desc    Login 
// @route   GET  /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
   // 1- check if email and password is correct (validation layer)
   // 2- get user
   const user = await User.findOne({ email: req.body.email })
   // 3- generate token
   const token = generateToken(user._id)

   // 4- send response
   req.user = user

   res.status(200).json({
      data: user,
      token
   })

})


// @desc make sure user is authenticated
exports.protect = asyncHandler(async (req, res, next) => {
   // 1- check if token ex.authorization
   const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''
   if (!token) {
      return next(new ApiError('you are not login, please login to get access this route.', 401))
   }


   // 2- verify token (no change happen | expired token) 
   const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);


   // 3- check if user exist
   const user = await User.findOne({ _id: decoded.userId })
   if (!user) {
      return next(new ApiError('the user belong to this token is\'t exist', 401))
   }


   // 4- check if user change his password after token created 
   if (user.changedPasswordAt) {
      const changedPasswordAtTimestamp = parseInt(user.changedPasswordAt.getTime() / 1000)

      // password was changed
      if (changedPasswordAtTimestamp > decoded.iat) {
         return next(new ApiError('this user changed his password recently, please login again', 401))
      }
   }


   req.user = user;
   next();
})


// @desc   Authorization (user permission)
exports.allowedTo = (...roles) => asyncHandler(
   async (req, res, next) => {
      // 1- access roles
      // 2- access registered user (req.user.role)
      if (!roles.includes(req.user.role)) {
         return next(new ApiError('this user have no permission to access this route', 403));
      }
      next()
   }
)


// @desc    Forget password  
// @route   POST  /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
   // 1- send user email get from validation layer
   const user = req.user
   // 2- if user exist => generate reset code 6 characters and save on db
   const resetCode = (Math.floor(Math.random() * 1000000) + 1).toString()

   // encrypt
   const hashedResetCode = crypto
      .createHash('sha512')
      .update(resetCode)
      .digest('hex')

   // save hashed reset code into database
   user.passwordResetCode = hashedResetCode
   // add expire date to hashed reset code
   user.passwordResetCodeExpired = Date.now() + 10 * 60 * 1000
   user.passwordResetVerified = false

   await user.save()

   // 3- send the reset user via email
   const name = user.username

   try {
      await sendEmail({
         email: user.email,
         subject: 'your password reset code ---- valid for 10 minutes ----',
         name,
         resetCode
      })
   } catch (err) {
      user.passwordResetCode = undefined
      user.passwordResetCodeExpired = undefined
      user.passwordResetVerified = undefined

      await user.save()
      return next(new ApiError('there is an error for sending email', 500))
   }

   res.status(200).json({
      status: 'success',
      message: 'reset code sent successfully'
   })

})



// @desc     verify reset code 
// @route   POST  /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {

   const hashedResetCode = crypto
      .createHash('sha512')
      .update(req.body.resetCode)
      .digest('hex')


   const user = await User.findOne({
      passwordResetCode: hashedResetCode,
   })


   if (!user) {
      return next(new ApiError('Invalid or expired reset code'));
   }

   user.passwordResetVerified = true;

   await user.save();

   res.status(200).json({
      status: 'success',
   })

})



// @desc    Reset password
// @route   POST  /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
   // 1- get user based on email
   const user = await User.findOne({ email: req.body.email })

   if (!user) {
      return next(new ApiError('no user matches this email', 404))
   }

   // 2- check if resetCode is verified
   if (!user.passwordResetVerified) {
      return next(new ApiError('reset code not verified', 400))
   }

   user.password = req.body.password
   user.passwordResetCode = undefined
   user.passwordResetCodeExpired = undefined
   user.passwordResetVerified = undefined

   // 3- generate token
   const token = await generateToken(user._id)

   await user.save()

   res.status(200).json({
      statue: 'success',
      msg: 'password changed successfully',
      token
   })
})

