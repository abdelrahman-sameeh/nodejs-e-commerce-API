const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');

const Brand = require('../models/brand-model');
const { uploadSingleImage } = require('../middleware/upload-image-middleware');
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require('./handler-factory');


exports.uploadBrandImage = uploadSingleImage('image')

exports.resizeBrandImage = AsyncHandler(async (req, res, next) => {
   const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
   await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`) 

   req.body.image = filename;
   next()
})       


// ***************************************   CRUD   ***************************************


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

