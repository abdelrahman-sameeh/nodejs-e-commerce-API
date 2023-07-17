const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const User = require('../models/user-model');
const { uploadSingleImage } = require('../middleware/upload-image-middleware');
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require('./handler-factory');
const { default: slugify } = require('slugify');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');


exports.uploadUserImage = uploadSingleImage('profileImage')

exports.resizeUserImage = AsyncHandler(async (req, res, next) => {
   const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
   await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/Users/${filename}`)

   req.body.profileImage = filename;
   next()
})


// ***************************************   CRUD   ***************************************


// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Protect -> (Admin)
exports.createUser = createOne(User, 'user')


// @desc    Get list of users
// @route   GET  /api/v1/users
// @access  Private/Protect -> (Admin)
exports.getListOfUsers = getListOfDocuments(User, 'user')



// @desc    Get specific user
// @route   GET  /api/v1/user/:id
// @access  Private/Protect -> (Admin)
exports.getSpecificUser = getOne(User, 'user')


// @desc    update specific user
// @route   PUT  /api/v1/user/:id
// @access  Private/Protect -> (Admin)
exports.updateSpecificUser = AsyncHandler(async (req, res, next) => {
   const id = req.params.id

   const data = {
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role
   }

   if (req.body.username) {
      data.slug = slugify(req.body.username)
   }


   const response = await User.findByIdAndUpdate(id, data, { new: true })
   if (!response) {
      return next(new ApiError(`no user matches this id ${id}`, 404))
   }
   res.status(200).json({ data: response })
})

// @desc    change password user
// @route   PUT  /api/v1/user/changePassword/:id
// @access  Private/Protect -> (Admin)
exports.updateChangePassword = AsyncHandler(async (req, res, next) => {
   const id = req.params.id

   const data = {
      password: await bcrypt.hash(req.body.password, 12),
      changedPasswordAt: Date.now()
   }

   const response = await User.findByIdAndUpdate(id, data, { new: true })
   if (!response) {
      return next(new ApiError(`no user matches this id ${id}`, 404))
   }
   res.status(200).json({ data: response })
})


// @desc    Delete specific user
// @route   DELETE  /api/v1/user/:id
// @access  Private/Protect -> (Admin)
exports.deleteSpecificUser = deleteOne(User, 'user')




// @desc    send Id To Body
exports.sendIdToBody = AsyncHandler(async (req, res, next) => {
   req.params.id = req.user._id
   next()
})

// @desc    update logged user password
// @route   PUT  /api/v1/auth/updateMyPassword
// @access  Private/Protect => user logged in my system
exports.updateLoggedUserPassword = AsyncHandler(async (req, res, next) => {
   const id = req.params.id

   const data = {
      password: await bcrypt.hash(req.body.password, 12),
      changedPasswordAt: Date.now()
   }

   const response = await User.findByIdAndUpdate(id, data, { new: true })
   if (!response) {
      return next(new ApiError(`no user matches this id ${id}`, 404))
   }
   const token = generateToken(response._id)

   res.status(200).json({ data: response, token })

})

// @desc    update logged data
// @route   PUT  /api/v1/auth/updateMyData
// @access  Private/Protect => user logged in my system
exports.updateLoggedUserDate = AsyncHandler(async (req, res, next) => {

   const response = await User.findOneAndUpdate({ _id: req.user._id },
      {
         username: req.body.username,
         phone: req.body.phone
      }
      , { new: true })

   res.status(200).json({ data: response })

})

// @desc    deActive logged user -> active = false 
// @route   PUT  /api/v1/auth/deleteMe
// @access  Private/Protect => user logged in my system
exports.deleteLoggedUser = AsyncHandler(async (req, res, next) => {

   await User.findOneAndUpdate({ _id: req.user._id },
      {
         active: false
      }
      , { new: true })

   res.status(204).send()

})