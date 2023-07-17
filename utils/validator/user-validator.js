const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");
const User = require("../../models/user-model");
const ApiError = require("../ApiError");
const bcrypt = require("bcryptjs")

exports.createUserValidator = [
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
   check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('enter a valid phone'),
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
   check('profileImage')
      .optional(),
   check('role')
      .optional(),
   validatorMiddleware
]

exports.getUserValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.updateUserValidator = [
   check('id')
      .isMongoId().withMessage('invalid category id format'),
   check('username')
      .optional()
      .isLength({ min: 2 }).withMessage('username must be 2 character or more'),
   check('email')
      .optional()
      .isEmail().withMessage('Please enter a valid email')
      // check if email is used or not
      .custom(async (value, { req }) => {
         const isUsed = await User.findOne({ email: value })
         if (isUsed) {
            throw new ApiError('this email already used', 400)
         }
         return true
      }),
   check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('enter a valid phone ,Only accept Egy and SA'),
   check('password')
      .optional()
      .isLength({ min: 6 }).withMessage('Too short password'),
   check('passwordConfirm')
      .optional()
      .notEmpty().withMessage('password confirmation is required')
      .custom((value, { req }) => {
         if (value !== req.body.password) {
            throw new Error('password confirmation is incorrect');
         }
         return true
      }),
   check('profileImage')
      .optional(),
   check('role')
      .optional(),
   validatorMiddleware
]
exports.deleteUserValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]



exports.updatePasswordValidation = [
   check('id')
      .isMongoId().withMessage('invalid category id format'),
   check('oldPassword')
      .notEmpty().withMessage('enter old password')
      .custom(async (value, { req }) => {
         const id = req.params.id;
         const user = await User.findById(id)
         const res = await bcrypt.compare(value, user.password)
         if (!res) {
            throw new Error('old password is incorrect')
         }
         return true
      }),
   check('password')
      .notEmpty().withMessage('enter new password')
      .isLength({ min: 6 }).withMessage('Too short new password')
      .custom((value, { req }) => {
         if (value !== req.body.PasswordConfirm) {
            throw new Error('password confirmation incorrect')
         }
         return true
      })
   , validatorMiddleware
]


exports.updateLoggedUserDataValidation = [
   check('username')
      .optional()
      .isLength({ min: 2 }).withMessage('username must be 2 character or more'),
   check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('enter a valid phone ,Only accept Egy and SA'),
   validatorMiddleware
]

