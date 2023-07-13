const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");

exports.getCategoryValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.updateCategoryValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.deleteCategoryValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.createCategoryValidator = [
   check('name')
      .notEmpty().withMessage('Category name required')
      .isLength({ max: 31 }).withMessage('Category name is too long')
      .isLength({ min: 3 }).withMessage('Category name is too short'),
   validatorMiddleware
]