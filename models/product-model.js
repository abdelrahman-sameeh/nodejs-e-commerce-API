const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema(
   {
      title: {
         type: String,
         trim: true,
         required: true,
         minLength: [3, 'product title must be greater than 3 characters'],
         maxLength: [100, 'product title must be less than 100 characters'],
      },
      slug: {
         type: String,
         lowercase: true,
      },
      description: {
         type: String,
         trim: true,
         required: [true, 'product description is required'],
         minLength: [15, 'Too short description of product'],
      },
      quantity: {
         type: Number,
         required: [true, 'product quantity is required'],
      },
      sold: {
         type: Number,
         default: 0
      },
      price: {
         type: Number,
         required: [true, 'product price is required'],
         trim: true
      },
      priceAfterDiscount: {
         type: Number,
      },
      colors: [String],
      imageCover: {
         type: String,
         required: [true, 'product image cover is required'],
      },
      images: [String],
      category: {
         type: mongoose.Schema.ObjectId,
         ref: 'Category',
         required: [true, 'product must be belong to category'],
      },
      subcategories: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
         }
      ],
      brand: {
         type: mongoose.Schema.ObjectId,
         ref: 'Brand',
      },
      ratingAverage: {
         type: Number,
         min: [1, 'rating must be greater than or equal 1'],
         max: [5, 'rating must be less than or equal 5'],
      },
      ratingQuantity: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
      // to enable virtual populate
      toJSON: { virtuals: true }, 
      toObject: { virtuals: true }
   }
)

productSchema.pre(/^find/, function (next) {
   this.populate({
      path: 'category',
      select: 'name'
   })
   next()
})


// set image with dynamic base url 
setProductImagesURL = (doc) => {
   if (doc.imageCover) {
      const imageCoverURL = `${process.env.BASE_URL}/products/${doc.imageCover}`
      doc.imageCover = imageCoverURL
   }
   if (doc.images) {
      let imageList = []
      doc.images.forEach(image => {
         const imageURL = `${process.env.BASE_URL}/products/${image}`
         imageList.push(imageURL)
      })
      doc.images = imageList
   }
}
// get
productSchema.post('init', (doc) => {
   setProductImagesURL(doc)
})

// create update
productSchema.post('save', (doc) => {
   setProductImagesURL(doc)
})


// set reviews array in product schema
productSchema.virtual('reviews', {
   ref: 'Review',
   foreignField: 'product',
   localField: '_id'
})



const Product = mongoose.model('Product', productSchema);



module.exports = Product;