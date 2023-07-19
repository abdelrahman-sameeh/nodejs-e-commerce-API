const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')


exports.addNewAddress = asyncHandler(async (req, res, next) => {
   const user = await User.findByIdAndUpdate(req.user._id, { $push: { addresses: req.body } }, { new: true })
   res.status(200).json({ status: 'success', addresses: user.addresses })
})



exports.removeAddress = asyncHandler(async (req, res, next) => {
   await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: { _id: req.params.addressId } } }, { new: true })
   res.status(204).send()
})


exports.getLoggedAddresses = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user._id)
   res.status(200).json({
      status: 'success',
      addresses: user.addresses
   })
})