const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validator-middleware");
const Category = require("../../models/category-model");
const SubCategory = require("../../models/sub-category-model");



exports.createProductValidator = [
   check('title')
      .notEmpty().withMessage('product title is required')
      .isLength({ min: 3 }).withMessage('product title must be greater than or equal to 3 characters')
      .isLength({ max: 100 }).withMessage('product title must be less than or equal to 100 characters'),
   check('description')
      .notEmpty().withMessage('product description is required')
      .isLength({ min: 15 }).withMessage('product description must be greater than or equal to 15 characters'),
   check('quantity')
      .notEmpty().withMessage('product quantity is required'),
   check('price')
      .toFloat()
      .isNumeric().withMessage('price must be number')
      .notEmpty().withMessage('product price is required')
      .custom((val, { req }) => {
         if (val <= req.body.priceAfterDiscount) {
            throw new Error('priceAfterDiscount must be less than price')
         }
         return true
      }),
   check('priceAfterDiscount')
      .toFloat()
      .optional()
      .isNumeric().withMessage('price must be number'),
   check('colors')
      .optional()
      .isArray().withMessage('images must be ab array'),
   check('imageCover')
      .notEmpty().withMessage('product image cover is required'),
   check('images')
      .optional()
      .isArray().withMessage('images must be ab array'),
   check('category')
      .isMongoId().withMessage('invalid ID format')
      .notEmpty().withMessage('product category is required')
      .custom(async (categoryId) => {
         const response = await Category.findById(categoryId)
         if (!response) {
            throw new Error(`no category match this ID => ${categoryId}`)
         }
         return true
      }),
   check('subcategories')
      .optional()
      .isMongoId().withMessage('invalid ID format')
      .isArray().withMessage('subcategories must be an array')
      .custom((async (subCategoriesIds) => {
         // remove duplication from subcategories ids
         subCategoriesIds = [...new Set(subCategoriesIds)]

         const response = await SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } })

         if (subCategoriesIds.length !== response.length) {
            throw new Error(`${subCategoriesIds.length - response.length} subcategory is not found in database from ${subCategoriesIds.length} sent`)
         }
         return true
      }))
      .custom((async (subCategoriesIds, { req }) => {
         // to remove duplication elements from array
         subCategoriesIds = [...new Set(subCategoriesIds)]

         /*
            @desc  get all subcategories in database and check if it is includes all sended subcategories 
         */
         const allSubCategoriesInCategory = await SubCategory.find({ category: req.body.category.toString() })

         const allSubCategoriesIds = allSubCategoriesInCategory.map(subCategory => subCategory._id.toString())

         let checker = false;

         checker = subCategoriesIds.every((subCategory) => {
            return allSubCategoriesIds.includes(subCategory)
         })

         if (!checker) {
            throw new Error('some sub category not belongs to main category')
         }
         return true
      }))
   ,
   check('brand')
      .optional()
      .isMongoId().withMessage('invalid ID format'),
   check('ratingAverage')
      .optional()
      .isLength({ min: 1 }).withMessage('rating must be greater than or equal 1')
      .isLength({ max: 5 }).withMessage('rating must be less than or equal 5'),
   validatorMiddleware
]

exports.getSpecificProductValidator = [
   check('id')
      .isMongoId().withMessage('invalid ID format'),
   validatorMiddleware
]
exports.updateSpecificProductValidator = [
   check('id')
      .isMongoId().withMessage('invalid ID format'),

   validatorMiddleware
]
exports.deleteSpecificProductValidator = [
   check('id')
      .isMongoId().withMessage('invalid ID format'),
   check('title')
      .optional()
      .isLength({ min: 3 }).withMessage('product title must be greater than or equal to 3 characters')
      .isLength({ max: 100 }).withMessage('product title must be less than or equal to 100 characters'),
   check('description')
      .optional()
      .isLength({ min: 15 }).withMessage('product description must be greater than or equal to 15 characters'),
   check('quantity')
      .optional(),
   check('price')
      .optional()
      .toFloat()
      .isNumeric().withMessage('price must be number')
      .custom((val, { req }) => {
         if (val <= req.body.priceAfterDiscount) {
            throw new Error('priceAfterDiscount must be less than price')
         }
         return true
      }),
   check('priceAfterDiscount')
      .toFloat()
      .optional()
      .isNumeric().withMessage('price must be number'),
   check('colors')
      .optional()
      .isArray().withMessage('images must be ab array'),
   check('imageCover')
      .optional(),
   check('images')
      .optional()
      .isArray().withMessage('images must be ab array'),
   check('category')
      .optional()
      .isMongoId().withMessage('invalid ID format')
      .custom(async (categoryId) => {
         const response = await Category.findById(categoryId)
         if (!response) {
            throw new Error(`no category match this ID => ${categoryId}`)
         }
         return true
      }),
   check('subcategories')
      .optional()
      .isMongoId().withMessage('invalid ID format')
      .isArray().withMessage('subcategories must be an array')
      .custom((async (subCategoriesIds) => {
         // remove duplication from subcategories ids
         subCategoriesIds = [...new Set(subCategoriesIds)]

         const response = await SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } })

         if (subCategoriesIds.length !== response.length) {
            throw new Error(`${subCategoriesIds.length - response.length} subcategory is not found in database from ${subCategoriesIds.length} sent`)
         }
         return true
      }))
      .custom((async (subCategoriesIds, { req }) => {
         // to remove duplication elements from array
         subCategoriesIds = [...new Set(subCategoriesIds)]

         /*
            @desc  get all subcategories in database and check if it is includes all sended subcategories 
         */
         const allSubCategoriesInCategory = await SubCategory.find({ category: req.body.category.toString() })

         const allSubCategoriesIds = allSubCategoriesInCategory.map(subCategory => subCategory._id.toString())

         let checker = false;

         checker = subCategoriesIds.every((subCategory) => {
            return allSubCategoriesIds.includes(subCategory)
         })

         if (!checker) {
            throw new Error('some sub category not belongs to main category')
         }
         return true
      }))
   ,
   check('brand')
      .optional()
      .isMongoId().withMessage('invalid ID format'),
   check('ratingAverage')
      .optional()
      .isLength({ min: 1 }).withMessage('rating must be greater than or equal 1')
      .isLength({ max: 5 }).withMessage('rating must be less than or equal 5'),
   validatorMiddleware
]