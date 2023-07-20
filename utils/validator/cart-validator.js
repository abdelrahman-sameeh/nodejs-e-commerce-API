const { check } = require("express-validator");
const Cart = require("../../models/cart-model");
const ApiError = require("../ApiError");

exports.removeProductFromCartValidator = [
   check('id')
      .isMongoId().withMessage('Invalid product id')
      .custom(async (value, { req }) => {
         // check if product is exist
         const cart = await Cart.findOne({ user: req.user._id })
         console.log(cart);
         const check = cart.cartItems.some(product => product._id.toString() === value)
         if(!check){
            throw new ApiError('no product match this id', 404)
         }
      })
] 