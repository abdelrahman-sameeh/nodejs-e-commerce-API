const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middleware/validator-middleware");
const ApiError = require("../ApiError");
const User = require("../../models/user-model");

exports.signupValidator = [
   check('username')
      .notEmpty().withMessage('username name required')
      .isLength({ min: 2 }).withMessage('username must be 2 character or more'),
   check('email')
      .notEmpty().withMessage('email is required')
      .isEmail().withMessage('Please enter a valid email')
      // check if email is used or not
      .custom(async (value, { req }) => {
         const isUsed = await User.findOne({ email: value })
         if (isUsed) {
            throw new ApiError('this email already used', 400)
         }
         return true
      }),
   check('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Too short password'),
   check('passwordConfirm')
      .notEmpty().withMessage('password confirmation is required')
      .custom((value, { req }) => {
         if (value !== req.body.password) {
            throw new Error('password confirmation is incorrect');
         }
         return true
      }),
   validatorMiddleware
]



exports.loginValidator = [
   check('email')
      .isEmail().withMessage('Please enter a valid email')
      .notEmpty().withMessage('email is required')
      .custom(async (value, { req }) => {
         const user = await User.findOne({ email: value });
         req.user = user
         if (!user) {
            throw new ApiError('email or password is incorrect', 401)
         }
         return true
      }),
   check('password')
      .isLength({ min: 2 }).withMessage('username must be 2 character or more')
      .notEmpty().withMessage('enter your password')
      .custom(async (value, { req }) => {
         const user = req.user
         if (user) {
            const isCorrect = await bcrypt.compare(value, user.password);
            if (!isCorrect) {
               throw new ApiError('email or password is incorrect', 401)
            }
            return true
         }
      })
   ,
   validatorMiddleware
]


exports.forgetPasswordValidator = [
   check('email')
      .notEmpty().withMessage('email is required')
      .isEmail().withMessage('enter valid email')
      .custom(async (value, { req }) => {
         const user = await User.findOne({ email: value });
         if (!user) {
            throw new ApiError('this email not exist', 404)
         }
         req.user = user
         return true
      }),
   validatorMiddleware
]

exports.verifyResetCodeValidator = [
   check('resetCode')
      .notEmpty().withMessage('reset code is required')
      .isLength({ min: 6 }).withMessage('reset code must be 6 chars'),
   validatorMiddleware
]


exports.resetPasswordValidator = [
   check('email')
      .notEmpty().withMessage('email is required')
      .isEmail().withMessage('enter a valid email'),
   check('password')
      .notEmpty().withMessage('password is required')
      .isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
   validatorMiddleware
]


