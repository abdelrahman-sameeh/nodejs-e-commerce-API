const { default: mongoose } = require("mongoose")

// 1-create schema
const categorySchema = mongoose.Schema({
   name: {
      type: String,
      trim: true,
      required: [true, 'Category name required'],
      unique: [true, 'Category must be unique'],
      maxlength: [32, 'Category name is too long'],
      minlength: [3, 'Category name is too short']
   },
   slug: {
      type: String,
      lowercase: true
   },
   image: String
}, { timestamps: true })


const setImageURL = (doc) => {
   if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
      doc.image = imageUrl
   }
}

// getOne, getAll, update
categorySchema.post('init', (doc) => {
   setImageURL(doc)
})
// create
categorySchema.post('save', (doc) => {
   setImageURL(doc)
})





// 2-create model
const Category = mongoose.model('Category', categorySchema)

module.exports = Category
