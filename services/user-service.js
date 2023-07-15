const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const AsyncHandler = require('express-async-handler');

const User = require('../models/user-model');
const { uploadSingleImage } = require('../middleware/upload-image-middleware');
const { deleteOne, updateOne, getOne, getListOfDocuments, createOne } = require('./handler-factory');


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
// @access  Private
exports.createUser = createOne(User, 'user')


// @desc    Get list of users
// @route   GET  /api/v1/users
// @access  Private
exports.getListOfUsers = getListOfDocuments(User, 'user')



// @desc    Get specific user
// @route   GET  /api/v1/user/:id
// @access  Private
exports.getSpecificUser = getOne(User, 'user')



// @desc    update specific user
// @route   PUT  /api/v1/user/:id
// @access  Private
exports.updateSpecificUser = updateOne(User, 'user')


// @desc    Delete specific user
// @route   DELETE  /api/v1/user/:id
// @access  Private
exports.deleteSpecificUser = deleteOne(User, 'user')

