const router = require ('express').Router()
const authControllers = require('../controllers/authControllers')
const { adminMiddleware } = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')


// admin and user router
router.get('/admin/get/target-country', authMiddleware, authControllers.admin_get_target_country)

// admin api
router.post('/admin-login', authControllers.admin_login)
router.post('/authorization-admin',adminMiddleware, authControllers.authoriz_admin)
router.get('/logout', adminMiddleware, authControllers.logout )
router.post('/admin/add/target-country', adminMiddleware, authControllers.admin_add_target_country)
router.delete('/admin/delete/target-country/:id', adminMiddleware, authControllers.admin_delete_target_country)
router.get('/admin/dashboard/get-dashboard-details', adminMiddleware, authControllers.admin_get_deshboard_details)
router.post('/admin/add/admin-profile-image', adminMiddleware, authControllers.add_admin_proifle_image)
router.get('/admin/get/profile/details', adminMiddleware, authControllers.admin_get_profileDetails)
router.patch('/admin/password/update-password', adminMiddleware, authControllers.admin_update_password)
router.get('/admin/get/new-order/count', adminMiddleware, authControllers.admin_get_new_orderCount)

// user api
router.post('/user/user-register', authControllers.register_user)
router.post('/user/user-login', authControllers.user_login)
router.patch('/user/acount/password/reset-password', authControllers.user_password_reset)
router.post('/user/authorization-user',authMiddleware, authControllers.authoriz_user)
router.get('/user/logout', authMiddleware, authControllers.user_logout )
router.post('/user/add-profile-info', authMiddleware, authControllers.profile_info_add)
router.post('/user/update-password', authMiddleware, authControllers.update_password)
router.get('/user/get/admin-image', authMiddleware, authControllers.user_get_admin_image)

module.exports = router;
