
const Product = require('../models/product-model');
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require('./handler-factory');



// @desc    Create a new Product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = createOne(Product, 'product')



// @desc    Get list of Product
// @route   GET /api/v1/products
// @access  Public
exports.getListOfProducts = getListOfDocuments(Product, 'product')


// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getSpecificProduct = getOne(Product, 'product')

// @desc    Update specific Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateSpecificProduct = updateOne(Product, 'product')

// @desc    Delete specific Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteSpecificProduct = deleteOne(Product, 'product')


