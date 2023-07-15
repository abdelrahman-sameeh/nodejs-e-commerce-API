const express = require('express');
const { createProduct, getListOfProducts, getSpecificProduct, deleteSpecificProduct, updateSpecificProduct, uploadProductImages, resizeProductImages } = require('../services/product-service');
const { createProductValidator, updateSpecificProductValidator, getSpecificProductValidator, deleteSpecificProductValidator } = require('../utils/validator/product-validator');
const router = express.Router();



router.route('/')
   .get(getListOfProducts)
   .post(
      uploadProductImages,
      resizeProductImages,
      createProductValidator,
      createProduct
   )
router.route('/:id')
   .get(getSpecificProductValidator, getSpecificProduct)
   .put(
      uploadProductImages,
      resizeProductImages,
      updateSpecificProductValidator,
      updateSpecificProduct
   )
   .delete(deleteSpecificProductValidator, deleteSpecificProduct)



module.exports = router