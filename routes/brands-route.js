const express = require('express');
const { createBrand, getListOfBrands, getSpecificBrands, deleteSpecificBrand, updateSpecificBrand, uploadBrandImage, resizeBrandImage } = require('../services/brands-service');
const { createBrandValidator, deleteBrandValidator, updateBrandValidator, getBrandValidator } = require('../utils/validator/brand-validator');

const router = express.Router();


router.route('/')
   .post(
      uploadBrandImage,
      resizeBrandImage,
      createBrandValidator,
      createBrand
   )
   .get(getListOfBrands)

router.route('/:id')
   .get(getBrandValidator, getSpecificBrands)
   .put(
      uploadBrandImage,
      resizeBrandImage,
      updateBrandValidator,
      updateSpecificBrand
   )
   .delete(deleteBrandValidator, deleteSpecificBrand)



module.exports = router