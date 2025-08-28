const router = require('express').Router()
const  categoryController = require('../controllers/categoryController')
const { adminMiddleware } = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')

// admin api 
router.post('/category/add-category',adminMiddleware, categoryController.category_add)
router.post('/category/delete_category',adminMiddleware, categoryController.category_delete)

// admin and user
router.get('/category/get-category', categoryController.category_get)

module.exports = router;
