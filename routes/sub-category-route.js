const { createSubCategory, getSpecificSubCategories, updateSpecificSubCategories, deleteSpecificSubCategories, getListOfSubCategory, setCategoryIdInBody, setFilterObjInBody } = require('../services/sub-category-service')
const { createSubCategoryValidator, getSpecificSubCategoryValidator, deleteSpecificSubCategoryValidator, updateSpecificSubCategoryValidator } = require('../utils/validator/sub-category-validator')

const express = require('express')
const router = express.Router({ mergeParams: true })
const authService = require('../services/auth-service')

router.route('/')
   .get(setFilterObjInBody, getListOfSubCategory)
   .post(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      setCategoryIdInBody,
      createSubCategoryValidator,
      createSubCategory
   )

router.route('/:id')
   .get(getSpecificSubCategoryValidator, getSpecificSubCategories)
   .put(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      updateSpecificSubCategoryValidator,
      updateSpecificSubCategories
   )
   .delete(
      authService.protect,
      authService.allowedTo('admin'),
      deleteSpecificSubCategoryValidator,
      deleteSpecificSubCategories
   )


module.exports = router