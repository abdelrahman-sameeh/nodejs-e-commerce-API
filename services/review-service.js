const asyncHandler = require('express-async-handler');
const { createOne, getListOfDocuments, getOne, updateOne, deleteOne } = require('./handler-factory');
const Review = require('../models/review-model');
const { getSpecificProduct } = require('./product-service');
const Product = require('../models/product-model');



// ---------------- for nested route -----------------
// @desc  Set filterObj Before Get all reviews in one product
exports.setFilterObjInBody = (req, res, next) => {
   let filterObj = {}
   if (req.params.productId) {
      filterObj = {
         product: req.params.productId
      }
   }
   req.filterObj = filterObj
   next()
}

// @desc  nested route post one review in one product
exports.setDataInBody = (req, res, next) => {
   if (!req.body.product) {
      req.body.product = req.params.productId
   }
   
   if (!req.body.user) {
      req.body.user = req.user._id
   }

   next()
}



// @ desc  get specific review in specific product 
// exports.getSpecificReviewInSpecificProduct = asyncHandler(async (req, res, next) => {
//    const { reviewId, productId } = req.params
//    const product = await Product.findById(productId)
//    .populate({path: 'reviews', select: 'title -user'})

//    const specificReview = product.reviews.filter(review => {
//       return review._id.toString() === reviewId
//    }) 

//    res.status(200).json({
//       data: specificReview[0]
//    })

// })


// ***************************************   CRUD   ***************************************

// @desc    Create Review
// @route   POST  /api/v1/Reviews
// @access  Private/protect => user
exports.createReview = createOne(Review, 'review')


// @desc    Get list of Review
// @route   GET  /api/v1/Review
// @access  Public
exports.getListOfReviews = getListOfDocuments(Review, 'review')



// @desc    Get specific Review
// @route   GET  /api/v1/Review/:id
// @access  Public
exports.getSpecificReview = getOne(Review, 'review')



// @desc    update specific Review
// @route   PUT  /api/v1/Review/:id
// @access  Private/protect => user
exports.updateSpecificReview = updateOne(Review, 'review')


// @desc    Delete specific Review
// @route   DELETE  /api/v1/Review/:id
// @access  Private/protect => user
exports.deleteSpecificReview = deleteOne(Review, 'review')



exports.setUserIdInBody = (req, res, next) => {
   req.body.userId = req.user._id
   next()
}