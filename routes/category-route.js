const express = require('express')
const router = express.Router()

const { createCategory, getAllCategories, getSpecificCategory, updateSpecificCategory, deleteCategory, uploadCategoryImage, resizeCategoryImage } = require('../services/category-service')
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../utils/validator/category-validator')
const subCategoryRoute = require('./sub-category-route')
const authService = require('../services/auth-service')



// nested route
// if original url === categories/:categoryId/subcategories
//       go to subcategories router 
router.use('/:categoryId/subcategories', subCategoryRoute)



router.route('/')
   .get(getAllCategories)
   .post(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadCategoryImage,
      resizeCategoryImage,
      createCategoryValidator,
      createCategory
   )



router.route('/:id')
   .get(getCategoryValidator, getSpecificCategory)
   .put(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadCategoryImage,
      resizeCategoryImage,
      updateCategoryValidator,
      updateSpecificCategory
   )
   .delete(
      authService.protect,
      authService.allowedTo('admin'),
      deleteCategoryValidator,
      deleteCategory
   )


module.exports = router
