const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");
const AsyncHandler = require("express-async-handler");

const Product = require('../models/product-model');
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require('./handler-factory');
const { uploadMixOfImages } = require('../middleware/upload-image-middleware');




exports.uploadProductImages = uploadMixOfImages([
   {
      name: 'imageCover',
      maxCount: 1
   },
   {
      name: 'images',
      maxCount: 10
   }
])



exports.resizeProductImages = AsyncHandler(async (req, res, next) => {
   // 1- image processing for imageCover
   if (req.files.imageCover) {
      const imageCoverFileName = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`)
      req.body.imageCover = imageCoverFileName
   }

   // 2- image processing for images
   if (req.files.images) {
      req.body.images = []
      await Promise.all(
         req.files.images.map(async (image, index) => {
            const imageName = `products-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            await sharp(image.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imageName}`)
            req.body.images.push(imageName)
         })
      )
   }

   next()


})



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


