const express = require('express');
const { createBrand, getListOfBrands, getSpecificBrands, deleteSpecificBrand, updateSpecificBrand } = require('../services/brands-service');
const { createBrandValidator, deleteBrandValidator, updateBrandValidator, getBrandValidator } = require('../utils/validator/brand-validator');

const router = express.Router();






router.route('/')
   .post(createBrandValidator, createBrand)
   .get(getListOfBrands)

router.route('/:id')
   .get(getBrandValidator, getSpecificBrands)
   .delete(deleteBrandValidator, deleteSpecificBrand)
   .put(updateBrandValidator, updateSpecificBrand)



module.exports = router