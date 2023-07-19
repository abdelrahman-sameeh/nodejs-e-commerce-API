const express = require('express');

const router = express.Router({ mergeParams: true });
const authService = require('../services/auth-service');
const { getListOfReviews, createReview, updateSpecificReview, deleteSpecificReview, getSpecificReview, setFilterObjInBody, setDataInBody, getSpecificReviewInSpecificProduct, setUserIdInBody } = require('../services/review-service');
const { createReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../utils/validator/review-validator');



// nested route 
// @method -> setFilterObjInBody
// GET 
// used to set filter object in body before sending it to {method} getListOfReviews

// nested route
// @method -> setDataInBody
// POST
// used to set filter object in body before sending it to {method} getListOfReviews

// @desc get specific review in specific product
// router.route('/specific').get(getSpecificReviewInSpecificProduct)

router.route('/')
   .get(setFilterObjInBody, getListOfReviews)
   .post(
      authService.protect,
      authService.allowedTo('user'),
      setDataInBody,
      createReviewValidator,
      createReview
   )

router.route('/:id')
   .get(getSpecificReview)
   .put(
      authService.protect,
      authService.allowedTo('user'),
      updateReviewValidator,
      updateSpecificReview
   )
   .delete(
      authService.protect,
      authService.allowedTo('user', 'admin'),
      setUserIdInBody,
      deleteReviewValidator,
      deleteSpecificReview
   )



module.exports = router