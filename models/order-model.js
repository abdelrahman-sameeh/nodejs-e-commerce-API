const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema({

   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'user is required']
   },
   cartItems: [
      {
         product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
         },
         quantity: Number,
         color: String,
         price: Number
      }
   ],
   // ضريبه
   taxPrice: {
      type: Number,
      default: 0
   },
   shippingPrice: {
      type: Number,
      default: 0
   },
   shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String
   },
   totalOrderPrice: Number,
   paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash',
   },
   isPaid: {
      type: Boolean,
      default: false,
   },
   paidAt: Date,
   isDelivered: {
      type: Boolean,
      default: false
   },
   deliveredAt: Date

}, { timestamps: true })


orderSchema.pre(/^find/, function (next) {
   this.populate({ path: 'user', select: 'username phone profileImage email' })
      .populate({ path: 'cartItems.product', select: 'title imageCover' })
   next()
})


module.exports = mongoose.model('Order', orderSchema)