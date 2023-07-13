const { default: mongoose } = require("mongoose");

const subCategorySchema = new mongoose.Schema({
   name: {
      type: String,
      trim: true,
      required: [true, 'SubCategory name is required'],
      unique: [true, 'SubCategory must be unique'],
      maxlength: [32, 'SubCategory name is too long'],
      minlength: [2, 'SubCategory name is too short'],
   },
   slug: {
      type: String,
      lowercase: true
   },
   category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must be belong to parent category'],
   }
}, { timestamps: true })

subCategorySchema.pre(/^find/, function (next){
   this.populate({
      path: 'category',
      select: 'name'
   })
   next()
})

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema)

module.exports = SubCategoryModel