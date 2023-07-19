const SubCategory = require("../models/sub-category-model");
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require("./handler-factory");


// @ desc  Set categoryId in body
exports.setCategoryIdInBody = (req, res, next)=>{
   if (!req.body.category) {
      req.body.category = req.params.categoryId
   }
   next()
}

   // nested route
// @desc  Set filterObj Before Get List Of SubCategory
exports.setFilterObjInBody = (req, res, next) => {
   let filterObj = {}
   if (req.params.categoryId) {
      filterObj = {
         category: req.params.categoryId
      }
   }
   req.filterObj = filterObj
   next()
}

// @desc   Create a new sub category
// @route  POST /api/v1/subcategories
// access  private
exports.createSubCategory = createOne(SubCategory, 'subcategory')



// @decs   Get list of sub categories
// @route  GET /api/v1/subcategories
// @access public
exports.getListOfSubCategory = getListOfDocuments(SubCategory)



// @decs   Get specific sub categories
// @route  GET /api/v1/subcategories/:id
// @access public
exports.getSpecificSubCategories = getOne(SubCategory, 'subcategory')



// @decs   update specific sub categories
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updateSpecificSubCategories = updateOne(SubCategory, 'subcategory')



// @decs   delete specific sub categories
// @route  DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSpecificSubCategories = deleteOne(SubCategory, 'subcategory')




