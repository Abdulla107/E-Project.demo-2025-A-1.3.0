const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');


router.post('/payment/refund/refund-request/:orderId', authMiddleware, paymentController.customer_refund_request)

// admin router
router.get('/admin/payment/get-refund-details',adminMiddleware, paymentController.admin_get_refund_details)
router.patch('/admin/order/payment/update-refund-status', adminMiddleware, paymentController.admin_update_refund_status)
router.get('/admin/payment/get-payment-details',adminMiddleware, paymentController.admin_get_payment_details)



module.exports = router;