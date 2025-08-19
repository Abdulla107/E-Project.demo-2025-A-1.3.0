const router = require('express').Router()
const wishlistController = require('../controllers/wishlistController')
const { authMiddleware } = require('../middlewares/authMiddleware')


router.post('/wishlist/add-to-wishlist',  wishlistController.add_to_wishlist)
router.post('/wishlist/get-wishlist/:userId',  wishlistController.get_wishlist)
router.post('/wishlist/remove-to-wishlist',  wishlistController.remove_to_wishlist)


module.exports = router;