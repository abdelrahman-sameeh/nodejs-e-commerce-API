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
}, {timestamps: true})

// 2-create model
const Category = mongoose.model('Category', categorySchema)



module.exports = Category
