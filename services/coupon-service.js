
const Coupon = require('../models/coupon-model')
const { createOne, getListOfDocuments, getOne, updateOne, deleteOne } = require('./handler-factory')


// @desc    Create Coupon
// @route   POST  /api/v1/coupons
// @access  Private
exports.createCoupon = createOne(Coupon, 'Coupon')


// @desc    Get list of Coupon
// @route   GET  /api/v1/coupon
// @access  Private/protect ==> (admin, manager)
exports.getListOfCoupons = getListOfDocuments(Coupon, 'Coupon')



// @desc    Get specific Coupon
// @route   GET  /api/v1/coupon/:id
// @access  Private/protect ==> (admin, manager)
exports.getSpecificCoupon = getOne(Coupon, 'Coupon')



// @desc    update specific Coupon
// @route   PUT  /api/v1/coupon/:id
// @access  Private/protect ==> (admin, manager)
exports.updateSpecificCoupon = updateOne(Coupon, 'Coupon')


// @desc    Delete specific Coupon
// @route   DELETE  /api/v1/coupon/:id
// @access  Private/protect ==> (admin, manager)
exports.deleteSpecificCoupon = deleteOne(Coupon, 'Coupon')

