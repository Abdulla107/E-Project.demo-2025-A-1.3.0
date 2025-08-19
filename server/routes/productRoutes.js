const router = require('express').Router()
const productController = require('../controllers/productController')
const { adminMiddleware } = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')

// admin rout
router.post('/product/add-product',adminMiddleware, productController.product_add)
router.get('/product/product-get/:productId',adminMiddleware, productController.product_get)
router.post('/product/product-update',adminMiddleware, productController.product_update)
router.post('/product/delete-product',adminMiddleware, productController.porduct_deleted)
router.post('/product/add-banner',adminMiddleware, productController.product_banner_add)
router.get('/product/get-banners', productController.product_banners_get)
router.get('/product/get-banner/:productId', productController.product_get_banner)
router.post('/prouct/delete-banner',adminMiddleware, productController.product_banner_delete)

// user and admin
router.get('/product/get-product',authMiddleware, productController.products_get) 

// user rout
router.get('/product/faeature-product', productController.feature_products_get)


module.exports = router;