const express = require('express')
const { uploadUserImage, resizeUserImage, createUser, getListOfUsers, updateSpecificUser, deleteSpecificUser, getSpecificUser, updateChangePassword, getLoggedData, updateLoggedUserPassword, sendIdToBody, updateLoggedUserDate, deleteLoggedUser } = require('../services/user-service')
const { createUserValidator, updateUserValidator, deleteUserValidator, getUserValidator, updatePasswordValidation, updateLoggedUserDataValidation } = require('../utils/validator/user-validator')
const router = express.Router()

const authService = require('../services/auth-service')


// user
router.get('/data', authService.protect, sendIdToBody, getSpecificUser)

router.put('/updateMyPassword', authService.protect, sendIdToBody, updatePasswordValidation, updateLoggedUserPassword)

router.put('/updateMyData', authService.protect, updateLoggedUserDataValidation, updateLoggedUserDate)

router.delete('/deleteMe', authService.protect, deleteLoggedUser)


// admin
router.route('/')
   .get(
      authService.protect,
      authService.allowedTo('admin'),
      getListOfUsers)
   .post(
      authService.protect,
      authService.allowedTo('admin'),
      uploadUserImage,
      resizeUserImage,
      createUserValidator,
      createUser
   )


router.route('/changePassword/:id').put(
   authService.protect,
   authService.allowedTo('admin'),
   updatePasswordValidation,
   updateChangePassword
)

router.route('/:id')
   .get(
      authService.protect,
      authService.allowedTo('admin'),
      getUserValidator,
      getSpecificUser
   )
   .put(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadUserImage,
      resizeUserImage,
      updateUserValidator,
      updateSpecificUser
   )
   .delete(
      authService.protect,
      authService.allowedTo('admin'),
      deleteUserValidator,
      deleteSpecificUser
   )


module.exports = router
