const express = require('express');
const { addProductToWishList, removeProductFromWishList, getUserWishList } = require('../services/wishList-service');
const router = express.Router();
const authService = require('../services/auth-service');
const { addWishListValidator, removeWishListValidator } = require('../utils/validator/wish-list-validator');


// to use it for all routes
router.use(
   authService.protect,
   authService.allowedTo('user')
)


router.route('/')
   .post(
      addWishListValidator,
      addProductToWishList
   )
   .get(
      getUserWishList
   )

router.route('/:productId')
   .delete(
      removeWishListValidator,
      removeProductFromWishList
   )





module.exports = router