const { default: mongoose } = require("mongoose");

const cartSchema = mongoose.Schema({
   cartItems: [
      {
         product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
         },
         quantity: {
            type: Number,
            default: 0
         },
         color: String,
         price: Number
      }
   ],
   totalCartPrice: Number,
   totalPriceAfterDiscount: Number,
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
   }
})


module.exports = mongoose.model('Cart', cartSchema)
