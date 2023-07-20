const express = require('express');

const router = express.Router();
const authService = require('../services/auth-service');
const { createCoupon, getListOfCoupons, getSpecificCoupon, updateSpecificCoupon, deleteSpecificCoupon } = require('../services/coupon-service');

router.use(
   authService.protect,
   authService.allowedTo('admin', 'manager')
)

router.route('/')
   .post(createCoupon)
   .get(getListOfCoupons)

router.route('/:id')
   .get(getSpecificCoupon)
   .put(updateSpecificCoupon)
   .delete(deleteSpecificCoupon)



module.exports = router