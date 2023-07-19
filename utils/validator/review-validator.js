const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");
const User = require("../../models/user-model");
const ApiError = require("../ApiError");
const Review = require("../../models/review-model");
const Product = require("../../models/product-model");

exports.createReviewValidator = [
   check('title')
      .notEmpty().withMessage('Review title is required'),
   check('rating')
      .notEmpty().withMessage('Review Rating is required')
      .isLength({ min: 1 }).withMessage('Min ratings value is 1.0')
      .isLength({ max: 5 }).withMessage('Max ratings value is 5.0'),
   check('user')
      .notEmpty().withMessage('Review must be belong to user')
      .isMongoId().withMessage('Invalid user ID')
      .custom(async (value, { req }) => {
         // 1- check if user exist
         const user = await User.findById(value)
         if (!user) {
            throw new ApiError('no user matches this id', 404)
         }
         // 2- check if this user written another review
         const review = await Review.findOne({ user: value, product: req.body.product })
         if (review) {
            throw new ApiError('user can\'t create more review in one product', 400)
         }
      }),
   check('product')
      .isMongoId().withMessage('Invalid product ID')
      .notEmpty().withMessage('Review must be belong to product')
      .custom(async (value, { req }) => {
         // check if product exist
         const product = await Product.findById(value)
         if (!product) {
            throw new ApiError('no product matches this id', 404)
         }
      })
   ,
   validatorMiddleware
]

exports.updateReviewValidator = [
   check('id')
      .notEmpty().withMessage('Review id is required')
      .isMongoId().withMessage('Review id is not valid ID')
      .custom(async (value, { req }) => {
         const review = await Review.findById(value)
         if (!review) {
            throw new ApiError('no review matches this id', 404)
         }
         req.review = review
      }),
   check('title')
      .optional(),
   check('rating')
      .optional()
      .notEmpty().withMessage('Review Rating is required')
      .isLength({ min: 1 }).withMessage('Min ratings value is 1.0')
      .isLength({ max: 5 }).withMessage('Max ratings value is 5.0'),
   check('user')
      .notEmpty().withMessage('Review must be belong to user')
      // .isMongoId().withMessage('Invalid user ID')
      .custom(async (value, { req }) => {
         // 1- check if user exist
         const user = await User.findById(value)
         if (!user) {
            throw new ApiError('no user matches this id', 404)
         }
         // 2- check if this user written another review
         if (!(req.review && req.review.user._id.toString() === value && req.review.product.toString() === req.body.product)) {
            throw new ApiError('user cannot update this review')
         }
      }),
   check('product')
      .isMongoId().withMessage('Invalid product ID')
      .notEmpty().withMessage('Review must be belong to product')
      .custom(async (value, { req }) => {
         // check if product exist
         const product = await Product.findById(value)
         if (!product) {
            throw new ApiError('no product matches this id', 404)
         }
      }),
   validatorMiddleware
]


exports.deleteReviewValidator = [
   // check if review belong to this user
   // check review id
   check('id')
      .isMongoId().withMessage('Invalid review ID'),
   // check user id
   check('userId')
      .isMongoId().withMessage('Invalid user ID')
      .custom(async (value, { req }) => {
         // console.log(value);
         // // check if review belongs to userId
         const review = await Review.findOne({ user: value, _id: req.params.id })
         if (!review) {
            throw new ApiError('this review not belongs to this user')
         }
      }),
   validatorMiddleware
]