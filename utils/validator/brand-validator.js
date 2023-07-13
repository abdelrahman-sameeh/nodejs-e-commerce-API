const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");

exports.getBrandValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.updateBrandValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.deleteBrandValidator = [
   check('id').isMongoId().withMessage('invalid category id format'),
   validatorMiddleware
]
exports.createBrandValidator = [
   check('name')
      .notEmpty().withMessage('Category name required')
      .isLength({ max: 31 }).withMessage('Category name is too long')
      .isLength({ min: 2 }).withMessage('Category name is too short'),
   validatorMiddleware
]