const router = require('express').Router();
const cardController = require('../controllers/cardController')
const { authMiddleware } = require('../middlewares/authMiddleware')


router.post('/product/add-to-card', cardController.add_to_card)
router.get('/product/get-card-product/:userId', cardController.get_card_products)
router.post('/product/quantity-inc', cardController.quantity_inc)
router.post('/product/quantity-dec', cardController.quantity_dec)
router.post('/product/delete-card-product/:productId', authMiddleware, cardController.delete_card_product)




module.exports = router;