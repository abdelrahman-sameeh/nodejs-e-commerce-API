const AsyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
const ApiError = require('../utils/ApiError')
const ApiFeature = require('../utils/ApiFeature')
const Product = require('../models/product-model')

/// @params {String} modelName 
// ==>the model name
/// @params {String} targetName  
// ==>the name of on document




// @desc   Create a new document
// @route  POST /api/v1/{modelName}
// access  private
exports.createOne = (modelName, targetName) =>
   AsyncHandler(async (req, res, next) => {

      const data = {
         ...req.body,
      }
      if (req.body.name) {
         data.slug = slugify(req.body.name)
      }
      if (req.body.title) {
         data.slug = slugify(req.body.title)
      }
      const response = await modelName.create(data)
      if (!response) {
         return next(new ApiError(`${targetName} not created`, 400));
      }
      res.status(201).json({
         data: response
      })
   })




// @decs   Get list of documents
// @route  GET /api/v1/{modelName}
// @access public
exports.getListOfDocuments = (Model, targetName = '') =>
   AsyncHandler(async (req, res) => {

      let filter = {};
      if (req.filterObj) {
         filter = req.filterObj
      }

      const documentCounts = await Model.countDocuments()
      // build mongoose query 
      const apiFeature = new ApiFeature(Model.find(filter), req.query)
         .pagination(documentCounts)
         .filter()
         .search(targetName)
         .limitFields()
         .sort()

      // execute mongoose query
      const { mongooseQuery, paginationResults } = apiFeature
      const response = await mongooseQuery;

      res.status(200).json({ results: response.length, paginationResults, data: response })
   })




// @decs   Get specific document
// @route  GET /api/v1/{modelName}/:id
// @access public
exports.getOne = (modelName, targetName) =>
   exports.getSpecificSubCategories = AsyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const response = await modelName.findById(id)
      if (!response) {
         return next(new ApiError(`no ${targetName} matches this id ${id}`, 404))
      }
      res.status(200).json({
         data: response
      })

   })





// @desc    Update specific categories
// @route   PUT  /api/v1/categories/:id
// @access  Private
exports.updateOne = (modelName, targetName) =>
   AsyncHandler(async (req, res, next) => {
      const id = req.params.id

      const data = {
         ...req.body,
      }

      if (req.body.name) {
         data.slug = slugify(req.body.name)
      }
      if (req.body.title) {
         data.slug = slugify(req.body.title)
      }


      const response = await modelName.findByIdAndUpdate(id, data, { new: true })
      if (!response) {
         return next(new ApiError(`no ${targetName} matches this id ${id}`, 404))
      }
      res.status(200).json({ data: response })

   })


// @desc    Delete specific categories
// @route   DELETE  /api/v1/{model}/:id
// @access  Private
exports.deleteOne = (modelName, targetName) =>
   AsyncHandler(async (req, res, next) => {
      const { id } = req.params
      const response = await modelName.findByIdAndDelete(id)

      if (!response) {
         return next(new ApiError(`no ${targetName} matches this id ${id}`, 404))
      }
      res.status(204).send()
   })
