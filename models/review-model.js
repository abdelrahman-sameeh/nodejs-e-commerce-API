const { default: mongoose } = require("mongoose");
const Product = require("./product-model");


const reviewSchema = mongoose.Schema({
   title: {
      type: String,
      required: [true, 'Review title is required']
   },
   rating: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'Review Rating is required']
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be belong to user']
   },
   product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must be belong to product']
   }
}, { timestamps: true })


reviewSchema.pre(/^find/, function (next) {
   this.populate({ path: 'user', select: 'username' })
   next()
})


// aggregation
reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
   const results = await this.aggregate([
      // stage 1 -----> filter all reviews by productId (get all reviews in one product)
      { $match: { product: productId } },
      // stage 2 -----> get qty and avg for this product
      { $group: { _id: 'product', ratingAvg: { $avg: '$rating' }, ratingQty: { $sum: 1 } } }
   ])


   if (results.length) {
      await Product.findOneAndUpdate({ _id: productId }, {
         ratingAverage: results[0].ratingAvg,
         ratingQuantity: results[0].ratingQty,
      })
   }else{
      await Product.findOneAndUpdate({ _id: productId }, {
         ratingAverage: 0,
         ratingQuantity: 0,
      })
   }

}

reviewSchema.post('save', async function () {
   await this.constructor.calcAverageRatingAndQuantity(this.product)
})

reviewSchema.post('remove', async function () {
   await this.constructor.calcAverageRatingAndQuantity(this.product)
})
 
const Review = mongoose.model('Review', reviewSchema)

module.exports = Review