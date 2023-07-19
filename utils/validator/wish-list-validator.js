const { check } = require("express-validator");
const User = require("../../models/user-model");
const ApiError = require("../ApiError");
const validatorMiddleware = require("../../middleware/validator-middleware");
const Product = require("../../models/product-model");

exports.addWishListValidator = [
   check('productId')
      .isMongoId().withMessage('product ID must be a valid ID')
      .notEmpty().withMessage('product ID is required')
      .custom(async (value, { req }) => {
         const product = await Product.findById(req.body.productId)
         if (!product) {
            throw new ApiError('no product match this ID', 404)
         }
      })
      .custom(async (value, { req }) => {
         const getUser = await User.findById(req.user._id)
         if (getUser.wishList && getUser.wishList.length) {
            const isExist = getUser.wishList.some(product => {
               return value.toString() === product.toString()
            })
            if (isExist) {
               throw new ApiError('this product already exists', 400)
            }
         }
      }),
   validatorMiddleware
]

exports.removeWishListValidator = [
   check('productId')
      .isMongoId().withMessage('product ID must be a valid ID')
      .notEmpty().withMessage('product ID is required')
      .custom(async (value, { req }) => {
         const product = await Product.findById(req.params.productId)
         if (!product) {
            throw new ApiError('no product match this ID', 404)
         }
      })
      .custom(async (value, { req }) => {
         const getUser = await User.findById(req.user._id)
         if (getUser.wishList && getUser.wishList.length) {
            const isExist = getUser.wishList.some(product => {
               return value.toString() === product.toString()
            })
            if (!isExist) {
               throw new ApiError('this product not found', 404)
            }
         }
      }),
   validatorMiddleware
] 