const { getAllProductInLoggedUserCart, setProductInLoggedUserCart, setUserIdInParams, removeItemFromCart, clearCart, applyCoupon } = require('../services/cart-service')

const router = require('express').Router()


const authService = require('../services/auth-service')
const { removeProductFromCartValidator } = require('../utils/validator/cart-validator')

router.use(
   authService.protect,
   authService.allowedTo('user')
)


router.route('/')
   .get(getAllProductInLoggedUserCart)
   .post(setProductInLoggedUserCart)
   .delete(clearCart)

router.delete(removeProductFromCartValidator, removeItemFromCart)

router.post('/applyCoupon', applyCoupon)




module.exports = router