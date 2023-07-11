const { default: slugify } = require("slugify");
const  Category  = require("../models/category-model");
const asyncHandler = require('express-async-handler')

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
   const name = req.body.name;
   const category = await Category.create({ name, slug: slugify(name) })
   res.status(201).json({ data: category })
})

// @desc    Get list of categories
// @route   GET  /api/v1/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
   const page = +req.query.page || 1
   const limit = +req.query.limit || 5
   const skip = (page - 1) * limit
   const categories = await Category.find({}).skip(skip).limit(limit)
   res.status(200).json({ results: categories.length, page, data: categories })
})

// @desc    Get specific categories
// @route   GET  /api/v1/categories/:id
// @access  Public
const getSpecificCategory = asyncHandler(async (req, res, next) => {
   const categoryId = req.params.id
   const oneCategory = await Category.findById(categoryId)
   if (!oneCategory) {
      res.status(404).json({ msg: `no category matches this id ${categoryId}` })
   } else {
      res.status(200).json({ data: oneCategory })
   }
})

// @desc    Update specific categories
// @route   PUT  /api/v1/categories/:id
// @access  Private
const updateSpecificCategory = asyncHandler( async (req, res, next) => {
   const id = req.params.id
   const data = {
      ...req.body,
      slug: slugify(req.body.name)
   }


   const category = await Category.findByIdAndUpdate(id, data, {new: true})
   if (!category) {
      res.status(404).json({ msg: `something went wrong when update` })
   }
   res.status(200).json({ data: category })

})

// @desc    Delete specific categories
// @route   DELETE  /api/v1/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async(req, res, next)=>{
   const {id} = req.params
   const category = await Category.findByIdAndDelete(id)
   
   if(!category){
      res.status(404).json({msg: 'something went wrong during delete'})
   }
   res.status(204).send()
})

module.exports = {
   createCategory,
   getAllCategories,
   getSpecificCategory,
   updateSpecificCategory,
   deleteCategory
}