const { createCategory, getAllCategories, getSpecificCategory, updateSpecificCategory, deleteCategory } = require('../services/category-service')

const express = require('express')
const router = express.Router()

router.route('/').post( createCategory).get(getAllCategories)
router.route('/:id').get(getSpecificCategory).put(updateSpecificCategory).delete(deleteCategory)


module.exports = router
