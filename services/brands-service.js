const Brand = require('../models/brand-model');
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require('./handler-factory');


// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = createOne(Brand, 'brand')


// @desc    Get list of brand
// @route   GET  /api/v1/brand
// @access  Public
exports.getListOfBrands = getListOfDocuments(Brand, 'brand')



// @desc    Get specific brand
// @route   GET  /api/v1/brand/:id
// @access  Public
exports.getSpecificBrands = getOne(Brand, 'brand')



// @desc    update specific brand
// @route   PUT  /api/v1/brand/:id
// @access  Public
exports.updateSpecificBrand = updateOne(Brand, 'brand')


// @desc    Delete specific brand
// @route   DELETE  /api/v1/brand/:id
// @access  Public
exports.deleteSpecificBrand = deleteOne(Brand, 'brand')

