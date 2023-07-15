const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");
const AsyncHandler = require("express-async-handler");

const Category = require("../models/category-model");
const { uploadSingleImage } = require("../middleware/upload-image-middleware");
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require("./handler-factory");


const uploadCategoryImage = uploadSingleImage('image')


const resizeCategoryImage = AsyncHandler(async (req, res, next) => {
   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

   await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`)

   // save image in body
   req.body.image = filename
   next()
})


// ***************************************   CRUD   ***************************************

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
const createCategory = createOne(Category, 'category');


// @desc    Get list of categories
// @route   GET  /api/v1/categories
// @access  Public
const getAllCategories = getListOfDocuments(Category, 'category')

// @desc    Get specific categories
// @route   GET  /api/v1/categories/:id
// @access  Public
const getSpecificCategory = getOne(Category, 'category')

// @desc    Update specific categories
// @route   PUT  /api/v1/categories/:id
// @access  Private
const updateSpecificCategory = updateOne(Category, 'category')

// @desc    Delete specific categories
// @route   DELETE  /api/v1/categories/:id
// @access  Private
const deleteCategory = deleteOne(Category, 'category')

module.exports = {
   createCategory,
   getAllCategories,
   getSpecificCategory,
   updateSpecificCategory,
   deleteCategory,
   uploadCategoryImage,
   resizeCategoryImage
}