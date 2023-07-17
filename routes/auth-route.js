const { signup, login, forgetPassword, verifyResetCode, resetPassword } = require('../services/auth-service');
const { signupValidator, loginValidator, forgetPasswordValidator, verifyResetCodeValidator, resetPasswordValidator } = require('../utils/validator/auth-validator');

const router = require('express').Router();





router.route('/signup')
   .post(signupValidator, signup)

router.route('/login')
   .get(loginValidator, login)

router.route('/forgetPassword')
   .post(forgetPasswordValidator, forgetPassword)

router.route('/verifyResetCode')
   .post(verifyResetCodeValidator, verifyResetCode)

router.route('/resetPassword')
   .put(resetPasswordValidator, resetPassword)




module.exports = router