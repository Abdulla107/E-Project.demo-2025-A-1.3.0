const router = require ('express').Router()
const homeController = require('../controllers/homeController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/home/get-products', homeController.get_products)
router.get('/home/price-range-product', homeController.price_range_product)
router.get('/home/query-products', homeController.query_products)
router.get('/home/product/get-productDetails/:productId', homeController.get_productDetails)
router.post('/home/product/add-customer-review', authMiddleware, homeController.add_customer_review)
router.get('/home/customer/get-reviews/:productId', homeController.get_reviews)
router.get('/home/customer/review_authorise/:productId',authMiddleware, homeController.review_authorise)


module.exports = router;