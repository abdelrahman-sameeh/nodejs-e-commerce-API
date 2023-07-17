const express = require('express');
const { createBrand, getListOfBrands, getSpecificBrands, deleteSpecificBrand, updateSpecificBrand, uploadBrandImage, resizeBrandImage } = require('../services/brands-service');
const { createBrandValidator, deleteBrandValidator, updateBrandValidator, getBrandValidator } = require('../utils/validator/brand-validator');

const router = express.Router();
const authService = require('../services/auth-service')

router.route('/')
   .post(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadBrandImage,
      resizeBrandImage,
      createBrandValidator,
      createBrand
   )
   .get(getListOfBrands)

router.route('/:id')
   .get(getBrandValidator, getSpecificBrands)
   .put(
      authService.protect,
      authService.allowedTo('admin', 'manager'),
      uploadBrandImage,
      resizeBrandImage,
      updateBrandValidator,
      updateSpecificBrand
   )
   .delete(
      authService.protect,
      authService.allowedTo('admin'),
      deleteBrandValidator,
      deleteSpecificBrand
   )



module.exports = router