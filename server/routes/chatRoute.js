const router = require('express').Router();
const chatController = require('../controllers/chatController');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const {authMiddleware} = require('../middlewares/authMiddleware');

// admin router
router.get('/chat/admin-get-customer', adminMiddleware, chatController.admin_get_customer)
router.get('/chat/admin/get-unSeen_message', adminMiddleware, chatController.get_admin_unSeen_message)
router.patch('/chat/update/message-status/:senderId', adminMiddleware, chatController.admin_update_message_status)
router.patch('/chat/update/one-message-status/:senderId', adminMiddleware, chatController.update_one_message_status)


// user and admin router
router.post('/chat/send-message', authMiddleware, chatController.send_message)
router.get('/chat/get-message/:Id', authMiddleware, chatController.get_message)
router.get('/chat/get-message/:Id', authMiddleware, chatController.get_message)

// user router
router.get('/chat/get-user-unSaw-message/:receverId', authMiddleware, chatController.get_user_unSaw_message)
router.patch('/chat/user/update/message-status/:receverId', authMiddleware, chatController.user_update_message_status)
router.patch('/chat/user/update/one-message-status/:receverId', authMiddleware, chatController.user_update_one_message_status)


module.exports = router;