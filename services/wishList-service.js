const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')


// @desc    add product to wishList 
// @route   POST /api/v1/wishList
// @access  private/protect => (user) 
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
   // $addToSet ==> add element to array if not exist
   // $push ==> add element to array if exist or not
   const { productId } = req.body
   const userId = req.user._id
   const response =
      await User
         .findOneAndUpdate({ _id: userId }, { $push: { wishList: productId } }, { new: true })
   // .populate({path: 'wishList'})
   res.status(200).json({
      status: 'success',
      msg: 'add product to wish list successfully',
      data: response.wishList
   })
})

// @desc    remove product from wishList 
// @route   DELETE /api/v1/wishList/:productId
// @access  private/protect => (user) 
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
   const { productId } = req.params
   const userId = req.user._id
   await User
      .findOneAndUpdate({ _id: userId }, { $pull: { wishList: productId } }, { new: true })
   res.status(204).send()
})


// @desc    get wishList 
// @route   GET /api/v1/wishList/
// @access  private/protect => (user) 
exports.getUserWishList = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user._id)
      .populate({ path: 'wishList'})
   res.status(200).json({
      status: 'success',
      withList: user.wishList
   })
})
