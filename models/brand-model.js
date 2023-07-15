const { default: mongoose } = require("mongoose");

const brandSchema = mongoose.Schema({
   name: {
      type: String,
      trim: true,
      required: [true, 'Brand name required'],
      unique: [true, 'Brand must be unique'],
      maxlength: [32, 'Brand name is too long'],
      minlength: [2, 'Brand name is too short']
   },
   slug: {
      type: String,
      lowercase: true,
   },
   image: String
}, { timestamps: true })


const setImageURL = (doc) => {
   if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`
      doc.image = imageUrl
   }
}

// getOne, getAll, update
brandSchema.post('init', (doc) => {
   setImageURL(doc)
})
// create
brandSchema.post('save', (doc) => {
   setImageURL(doc)
})

const Brand = mongoose.model('Brands', brandSchema)

module.exports = Brand