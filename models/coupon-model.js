const { default: mongoose } = require("mongoose");

const couponSchema = mongoose.Schema({
   name: {
      type: String,
      trim: true,
      required: [true, 'coupon name is required'],
      unique: [true, 'coupon name must be unique']
   },
   expire: {
      type: Date,
      required: [true, 'coupon expire date is required'],
   },
   discount: {
      type: Number,
      required: [true, 'coupon discount is required'],
   }
}, { timestamps: true })


const Coupon = mongoose.model('Coupon', couponSchema)


module.exports = Coupon