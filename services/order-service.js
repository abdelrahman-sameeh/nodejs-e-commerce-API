const stripe = require('stripe')(`${process.env.STRIPE_SECRET}`)
const asyncHandler = require('express-async-handler');
const factory = require('./handler-factory');
const ApiError = require('../utils/ApiError');

const Order = require('../models/order-model');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const User = require('../models/user-model');



// @desc       create cash order
// @route      POST   /api/v1/orders/:cartId
// @access     Private-protect/ user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
   const taxPrice = 0, shippingPrice = 0;

   // 1- get user cart depend on cartId
   const cart = await Cart.findById(req.params.id)
   if (!cart) {
      return next(new ApiError('no cart match this id', 404))
   }
   // 2- get order price depend on cart 'check if coupon applied'
   let totalOrderPrice = cart.totalCartPrice;
   if (cart.totalPriceAfterDiscount) {
      totalOrderPrice = cart.totalPriceAfterDiscount + taxPrice + shippingPrice
   }


   // 3- create order with default payment method
   const data = {
      user: req.user._id,
      cartItems: cart.cartItems,
      totalOrderPrice,
      shippingAddress: req.body.shippingAddress
   }
   const order = await Order.create(data)

   // 4- update product qty and sold
   if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
         updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
         }
      }))
      await Product.bulkWrite(bulkOption)


      // don't use to because save() event emitted in this loop and add base url in each  
      // cart.cartItems.map(async (item) => {
      //    const product = await Product.findById(item.product)
      //    product.quantity -= item.quantity
      //    product.sold += item.quantity;
      //    await product.save()
      // })

      // 5- delete cart depend on cartId
      await Cart.findByIdAndDelete(req.params.id)
   }

   res.status(201).json({
      data: order
   })

})


// put filter object in req 
exports.filterObjectForLoggedUser = (req, res, next) => {
   if (req.user.role === 'user') {
      req.filterObj = {
         user: req.user._id
      }
   }
   next()
}

// @desc       get list of orders
// @route      GET   /api/v1/orders
// @access     Private-protect/ user - admin - manager
exports.getListOfOrders = factory.getListOfDocuments(Order, 'order')



// @desc       get specific order
// @route      GET   /api/v1/orders/:orderId
// @access     Private-protect/ user - admin - manager
exports.getSpecificOrder = factory.getOne(Order, 'order')




// @desc       update order to paid
// @route      PUT   /api/v1/orders/:orderId/pay
// @access     Private-protect/ admin - manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
   // 1- get order 
   const order = await Order.findById(req.params.id)
   if (!order) {
      return next(new ApiError(`No order match this id ${req.params.id}`, 404))
   }
   // 2- update order
   order.isPaid = true;
   order.paidAt = Date.now();

   const updatedOrder = await order.save()
   res.status(200).json({ data: updatedOrder })
})



// @desc       update order to delivered
// @route      PUT   /api/v1/orders/:orderId/delivered
// @access     Private-protect/ admin - manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
   // 1- get order 
   const order = await Order.findById(req.params.id)
   if (!order) {
      return next(new ApiError(`No order match this id ${req.params.id}`, 404))
   }
   // 2- update order
   order.isDelivered = true;
   order.deliveredAt = Date.now();

   const updatedOrder = await order.save()
   res.status(200).json({ data: updatedOrder })
})




// @desc       Get checkout session and send as a response
// @route      GET   /api/v1/orders/checkout-session/cartId
// @access     Private-protect/ user
exports.createStripeSession = asyncHandler(async (req, res, next) => {
   const taxPrice = 0, shippingPrice = 0;

   // 1- get user cart depend on cartId
   const cart = await Cart.findById(req.params.id)
   if (!cart) {
      return next(new ApiError('no cart match this id', 404))
   }
   // 2- get order price depend on cart 'check if coupon applied'
   let totalOrderPrice = cart.totalCartPrice + taxPrice + shippingPrice;
   if (cart.totalPriceAfterDiscount) {
      totalOrderPrice = cart.totalPriceAfterDiscount + taxPrice + shippingPrice
   }



   // 3- create stripe session
   const session = await stripe.checkout.sessions.create({
      line_items: [{
         price_data: {
            currency: 'egp',
            unit_amount: totalOrderPrice * 100,
            product_data: {
               name: req.user.username,
            },
         },
         quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/orders`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      client_reference_id: req.params.id,
      customer_email: req.user.email,
      metadata: req.body.shippingAddress,
   });

   // 4) send session to response
   res.status(200).json({ status: 'success', session });

})



const createCardOrder = async (session) => {
   const cartId = session.client_reference_id
   const totalOrderPrice = session.amount_total / 100
   const shippingAddress = session.metadata
   const userEmail = session.email

   // 1- get user cart depend on cartId
   const cart = await Cart.findById(cartId)
   const user = await User.findOne({ email: userEmail })


   // 2- create order
   const data = {
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice,
      shippingAddress,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethod: 'card'
   }

   const order = await Order.create(data)

   // 3- update product qty and sold
   if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
         updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
         }
      }))
      await Product.bulkWrite(bulkOption)
   }

   // 4- delete cart 
   await Cart.findByIdAndDelete(cartId)

}


// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res) => {
   const sig = req.headers['stripe-signature'];

   let event;


   try {
      event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
      );
   } catch (err) {
      console.log(err);
      return res.status(400).json({
         error: err.message
      });
   }

   console.log(event.type);

   // if (event.type == 'checkout.session.completed') {
   //    createCardOrder(event.data.object)
   // } else {
   //    createCardOrder(event.data.object)
   // }

   res.status(200).json({
      received: true
   })

})