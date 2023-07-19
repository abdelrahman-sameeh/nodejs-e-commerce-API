const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");
const User = require("../../models/user-model");
const ApiError = require("../ApiError");

exports.addNewAddressValidator = [
   check('alias')
      .notEmpty().withMessage('alias is required')
      .isLength({ min: 3 }).withMessage('Too short alias name')
      .custom(async (value, { req }) => {
         // check if this address info is already exist in addresses array in user
         const user = await User.findById(req.user._id)
         if (user.addresses && user.addresses.length) {
            user.addresses.map(address => {
               if (
                  req.body.alias === address.alias &&
                  req.body.details === address.details &&
                  req.body.phone === address.phone &&
                  req.body.city === address.city &&
                  req.body.postalCode === address.postalCode
               ) {
                  throw new ApiError('this address already exists')
               }
            })
         }
      }),
   check('details')
      .notEmpty().withMessage('details is required')
      .isLength({ min: 14 }).withMessage('Too short details'),
   check('phone')
      .notEmpty().withMessage('phone is required')
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('accept only Egy or SA'),
   check('city')
      .notEmpty().withMessage('city is required'),
   check('postalCode')
      .notEmpty().withMessage('postalCode is required'),
   validatorMiddleware
]


exports.removeAddressValidator = [
   check('addressId')
      .isMongoId().withMessage('Invalid address ID')
]