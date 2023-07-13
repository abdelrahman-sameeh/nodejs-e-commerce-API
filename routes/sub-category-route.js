const { createSubCategory, getSpecificSubCategories, updateSpecificSubCategories, deleteSpecificSubCategories, getListOfSubCategory, setCategoryIdInBody, setFilterObjInBody } = require('../services/sub-category-service')
const { createSubCategoryValidator, getSpecificSubCategoryValidator, deleteSpecificSubCategoryValidator, updateSpecificSubCategoryValidator } = require('../utils/validator/sub-category-validator')

const express = require('express')
const router = express.Router({mergeParams: true})


router.route('/')
   .get(setFilterObjInBody, getListOfSubCategory)
   .post(setCategoryIdInBody, createSubCategoryValidator, createSubCategory)

router.route('/:id')
   .get(getSpecificSubCategoryValidator, getSpecificSubCategories)
   .put(updateSpecificSubCategoryValidator, updateSpecificSubCategories)
   .delete(deleteSpecificSubCategoryValidator, deleteSpecificSubCategories)


module.exports = router