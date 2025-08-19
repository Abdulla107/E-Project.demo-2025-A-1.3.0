const router = require('express').Router()
const orderController = require('../controllers/orderController')
const payPal_pay_controllers = require('../controllers/payPal_pay_controller')
const { adminMiddleware } = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')

// Customer Order Routes
router.post('/order/shipping-info',authMiddleware, orderController.add_shipping_info)
router.get('/order/get-shipping-info/:userId',authMiddleware, orderController.get_shipping_info)
router.post('/order/place-order',authMiddleware, orderController.place_order)
router.get('/order/get-deshboard-orders/:userId', authMiddleware, orderController.get_deshboard_orders)
router.get('/order/get-orders',authMiddleware, orderController.get_orders)
router.get('/order/get-order/:orderId',authMiddleware, orderController.get_order)


// Customer payPal payment Routes------------------- 
router.post('/customer/order/createPayment',payPal_pay_controllers.createPayment);
router.get('/paypal/success', payPal_pay_controllers.executePayment);
router.get('/paypal/cancel', payPal_pay_controllers.cancelPayment);

// Admin Routes
router.get('/admin/order/get-orders', adminMiddleware, orderController.admin_get_orders);
router.get('/admin/order/get-order/:orderId', adminMiddleware, orderController.admin_get_order)
router.patch('/admin/order/order-status-update', adminMiddleware, orderController.admin_update_order_status)



module.exports = router;