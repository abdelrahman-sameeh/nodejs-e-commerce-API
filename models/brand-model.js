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
   }
}, { timestamps: true })

const Brand = mongoose.model('Brands', brandSchema)

module.exports = Brand