const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");




exports.createSubCategoryValidator = [
   check('name')
      .notEmpty().withMessage('SubCategory name is required')
      .isLength({ max: 32 }).withMessage('SubCategory name is too long')
      .isLength({ min: 2 }).withMessage('SubCategory name is too short'),
   check('category')
      .notEmpty().withMessage('category name is required')
      .isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]

exports.getSpecificSubCategoryValidator = [
   check('id')
      .isMongoId().withMessage('invalid subcategory id'),
   validatorMiddleware
]

exports.updateSpecificSubCategoryValidator = [
   check('id')
      .isMongoId().withMessage('invalid subcategory id'),
   check('name')
      .notEmpty().withMessage('SubCategory name is required')
      .isLength({ max: 32 }).withMessage('SubCategory name is too long')
      .isLength({ min: 2 }).withMessage('SubCategory name is too short'),
   check('category')
      .isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]

exports.deleteSpecificSubCategoryValidator = [
   check('id')
      .isMongoId().withMessage('invalid subcategory id'),
   validatorMiddleware
]