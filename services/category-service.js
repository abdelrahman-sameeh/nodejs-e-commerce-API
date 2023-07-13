const Category = require("../models/category-model");
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require("./handler-factory");

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
   deleteCategory
}