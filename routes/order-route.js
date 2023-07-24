
const router = require('express').Router()

const authService = require('../services/auth-service')
const { createCashOrder, getListOfOrders, filterObjectForLoggedUser, getSpecificOrder, updateOrderToPaid, updateOrderToDelivered, getStripeSession, createStripeSession } = require('../services/order-service')

router.use(authService.protect);

// create stripe session
router.get(
   '/checkout-session/:id',
   authService.allowedTo('user'),
   createStripeSession
)


router.route('/')
   .get(
      authService.allowedTo('user', 'admin', 'manager'),
      filterObjectForLoggedUser,
      getListOfOrders
   )

router.route('/:id')
   .post(
      authService.allowedTo('user'),
      createCashOrder
   )
   .get(
      authService.allowedTo('user', 'admin', 'manager'),
      getSpecificOrder
   )



router.use(authService.allowedTo('admin', 'manager'))

router.route('/:id/pay').put(updateOrderToPaid)
router.route('/:id/delivered').put(updateOrderToDelivered)




module.exports = router