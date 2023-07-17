const express = require('express');
const { createProduct, getListOfProducts, getSpecificProduct, deleteSpecificProduct, updateSpecificProduct, uploadProductImages, resizeProductImages } = require('../services/product-service');
const { createProductValidator, updateSpecificProductValidator, getSpecificProductValidator, deleteSpecificProductValidator } = require('../utils/validator/product-validator');
const router = express.Router();

const authService = require('../services/auth-service')

router.route('/')
   .get(getListOfProducts)
   .post(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadProductImages,
      resizeProductImages,
      createProductValidator,
      createProduct
   )
router.route('/:id')
   .get(getSpecificProductValidator, getSpecificProduct)
   .put(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadProductImages,
      resizeProductImages,
      updateSpecificProductValidator,
      updateSpecificProduct
   )
   .delete(
      authService.protect,
      authService.allowedTo('admin'),
      deleteSpecificProductValidator,
      deleteSpecificProduct
   )



module.exports = router