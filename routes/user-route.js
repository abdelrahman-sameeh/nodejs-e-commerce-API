const express = require('express')
const { uploadUserImage, resizeUserImage, createUser, getListOfUsers, updateSpecificUser, deleteSpecificUser, getSpecificUser } = require('../services/user-service')
const { createUserValidator, updateUserValidator, deleteUserValidator, getUserValidator } = require('../utils/validator/user-validator')
const router = express.Router()


router.route('/')
   .get(getListOfUsers)
   .post(
      uploadUserImage,
      resizeUserImage,
      createUserValidator,
      createUser
   )



router.route('/:id')
   .get(getUserValidator, getSpecificUser)
   .put(
      uploadUserImage,
      resizeUserImage,
      updateUserValidator,
      updateSpecificUser
   )
   .delete(deleteUserValidator, deleteSpecificUser)


module.exports = router
