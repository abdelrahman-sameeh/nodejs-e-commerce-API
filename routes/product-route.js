const express = require('express');
const { createProduct, getListOfProducts, getSpecificProduct, deleteSpecificProduct, updateSpecificProduct } = require('../services/product-service');
const { createProductValidator, updateSpecificProductValidator, getSpecificProductValidator, deleteSpecificProductValidator } = require('../utils/validator/product-validator');
const router = express.Router();



router.route('/')
   .get(getListOfProducts)
   .post(createProductValidator, createProduct)
router.route('/:id')
   .get(getSpecificProductValidator, getSpecificProduct)
   .put(updateSpecificProductValidator, updateSpecificProduct)
   .delete(deleteSpecificProductValidator, deleteSpecificProduct)



module.exports = router