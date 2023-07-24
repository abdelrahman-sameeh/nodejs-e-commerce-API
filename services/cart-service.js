const Cart = require('../models/cart-model')
const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');
const ApiError = require('../utils/ApiError');
const Coupon = require('../models/coupon-model');


// @desc     calculate total cart price
const calcTotalCartPrice = (cart) => cart.cartItems.map((item) => (item.price * item.quantity))
   .reduce((curr, acc) => curr + acc)


// @desc     get All Product In Logged User Cart
// @route    GET   /api/v1/cart
// @access   Private/protect => (user)
exports.getAllProductInLoggedUserCart = asyncHandler(async (req, res, next) => {
   const cart = await Cart.findOne({ user: req.user._id })
   if (!cart) {
      return next(new ApiError(`there is no cart for this user ${req.user._id}`));
   }
   res.status(200).json({
      status: 'success',
      numberOfCartItems: cart.cartItems.length,
      data: cart
   })
})


// @desc     set Product In Logged User Cart
// @route    POST   /api/v1/cart
// @access   Private/protect => (user)
exports.setProductInLoggedUserCart = asyncHandler(async (req, res, next) => {

   const { productId, quantity, color } = req.body

   const product = await Product.findById(productId)

   let cart = await Cart.findOne({ user: req.user._id })


   if (!cart) {
      // if have no cart
      // 1- create cart and set data on it
      cart = await Cart.create({
         user: req.user._id,
         cartItems: [{
            product: productId,
            quantity,
            color,
            price: product.price
         }],
      })
   } else {
      // if have a cart
      // check if productId in cartItem if not => push it else update qty
      let indexProduct = cart.cartItems.findIndex(item => {
         if (item.color === color && item.product.toString() === productId) {
            return true
         }
      })

      if (indexProduct > -1) {
         //productId in cartItem if not => push it else update qty
         const cartItem = cart.cartItems[indexProduct];
         cartItem.quantity += quantity;
         cart.cartItems[indexProduct] = cartItem;
      } else {
         cart.cartItems.push({
            product: productId,
            quantity,
            color,
            price: product.price
         })
      }
   }

   // calculate total cart price
   const totalCartPrice = calcTotalCartPrice(cart)
   cart.totalCartPrice = totalCartPrice

   // to reset discount after add new item to cart
   cart.totalPriceAfterDiscount = undefined


   await cart.save()

   res.status(200).json({
      status: 'success',
      msg: 'product added to cart successfully',
      numberOfCartItems: cart.cartItems.length,
      cart
   })
})

// @desc     remove Item From Cart
// @route    DELETE   /api/v1/cart/:id
// @access   Private/protect => (user)
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
   const { id } = req.params
   const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { _id: id } } },
      { new: true }
   )
   if (!cart) {
      return next(new ApiError(`there is no cart for this user ${req.user._id}`));
   }

   // calculate total cart price
   const totalCartPrice = calcTotalCartPrice(cart)
   cart.totalCartPrice = totalCartPrice


   await cart.save()
   res.status(200).json({
      numberOfCartItems: cart.cartItems.length,
      data: cart
   })
})


// @desc     remove all cart Cart
// @route    DELETE   /api/v1/cart
// @access   Private/protect => (user)
exports.clearCart = asyncHandler(async (req, res, next) => {
   const cart = await Cart.findOneAndDelete({ user: req.user._id })
   if (!cart) {
      return next(new ApiError(`there is no cart for this user ${req.user._id}`));
   }
   res.status(204).send()
})


// @desc     apply coupon for cart
// @route    DELETE   /api/v1/cart/applyCoupon
// @access   Private/protect => (user)
exports.applyCoupon = asyncHandler(async (req, res, next) => {

   // 1- check if coupon is expired 
   const coupon = await Coupon.findOne({ name: req.body.name, expire: { $gt: Date.now() } })

   if (!coupon) {
      return next(new ApiError('coupon not found or expired'), 404);
   }

   // 2- get cart to calc priceAfterDiscount
   const cart = await Cart.findOne({ user: req.user._id })
   const totalPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100

   cart.totalPriceAfterDiscount = totalPriceAfterDiscount.toFixed(2)

   cart.save()


   res.status(200).json({
      status: 'success',
      numberOfCartItems: cart.cartItems.length,
      data: cart
   })

})