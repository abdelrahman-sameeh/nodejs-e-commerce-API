const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');
const { addNewAddress, removeAddress, getLoggedAddresses } = require('../services/address-service');
const { addNewAddressValidator, removeAddressValidator } = require('../utils/validator/address-validator');

// to use it for all routes
router.use(
   authService.protect,
   authService.allowedTo('user')
)


router.route('/')
   .post(
      addNewAddressValidator,
      addNewAddress
   )
   .get(
      getLoggedAddresses
   )

router.route('/:addressId')
   .delete(
      removeAddressValidator,
      removeAddress
   )

module.exports = router