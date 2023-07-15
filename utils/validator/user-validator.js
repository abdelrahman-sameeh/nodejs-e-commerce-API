const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");
const User = require("../../models/user-model");
const ApiError = require("../ApiError");

exports.createUserValidator = [
   check('username')
      .notEmpty().withMessage('username name required')
      .isLength({min: 2}).withMessage('username must be 2 character or more'),
   check('email')
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
      .isLength({min: 2}).withMessage('username must be 2 character or more'),
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
