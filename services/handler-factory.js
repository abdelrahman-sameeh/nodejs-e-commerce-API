const AsyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
const ApiError = require('../utils/ApiError')
const ApiFeature = require('../utils/ApiFeature')
const Product = require('../models/product-model')

/// @params {String} Model 
// ==>the model name
/// @params {String} targetName  
// ==>the name of on document




// @desc   Create a new document
// @route  POST /api/v1/{Model}
// access  private
exports.createOne = (Model, targetName) =>
   AsyncHandler(async (req, res, next) => {

      const data = {
         ...req.body,
      }
      // for username
      if (req.body.username) {
         data.slug = slugify(req.body.username)
      }
      // for category and brands name
      if (req.body.name) {
         data.slug = slugify(req.body.name)
      }
      // for product title
      if (req.body.title) {
         data.slug = slugify(req.body.title)
      }

      const response = await Model.create(data)
      if (!response) {
         return next(new ApiError(`${targetName} not created`, 400));
      }
      res.status(201).json({
         data: response
      })
   })




// @decs   Get list of documents
// @route  GET /api/v1/{Model}
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
// @route  GET /api/v1/{Model}/:id
// @access public
exports.getOne = (Model, targetName, populateOpt) =>
   exports.getSpecificSubCategories = AsyncHandler(async (req, res, next) => {
      const { id } = req.params;


      // 1- build query
      let query = Model.findById(id)


      // use it to get specific order 
      if (req.user.role === 'user' && targetName === 'order') {
         query = Model.findOne({ user: req.user._id, _id: id })
      }


      if (populateOpt) {
         query = query.populate(populateOpt)
      }

      // 2- execute query 
      const response = await query;

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
exports.updateOne = (Model, targetName) =>
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


      const response = await Model.findByIdAndUpdate(id, data, { new: true })
      if (!response) {
         return next(new ApiError(`no ${targetName} matches this id ${id}`, 404))
      }

      // trigger for 'save' event ===> to change qty value and avg value in db 
      response.save()

      res.status(200).json({ data: response })

   })


// @desc    Delete specific categories
// @route   DELETE  /api/v1/{model}/:id
// @access  Private
exports.deleteOne = (Model, targetName) =>
   AsyncHandler(async (req, res, next) => {
      const { id } = req.params
      const response = await Model.findByIdAndDelete(id)

      // trigger for 'save' or 'remove' event ===> to change qty value and avg value in db 
      // response.save() or 'remove()'
      if (targetName === 'review') {
         const test = await Model.findOneAndUpdate({}, {})
         test.save()
      }

      // handle error 
      if (!response) {
         return next(new ApiError(`no ${targetName} matches this id ${id}`, 404))
      }


      res.status(204).send()
   })
