const wishlistModel = require("../models/wishlistModel");
const { responseReturn } = require("../utiles/response");
const { mongo: { ObjectId } } = require('mongoose')


class wishlistController {


    add_to_wishlist = async (req, res) => {

        const { userId, productId, name, price, image, discount, rating, slug, delivery_charge } = req.body;


        try {

            if (!userId || !productId || !name || !price || !image || !slug || !delivery_charge) {
                return responseReturn(res, 400, { error: 'Some data is missing. Please try again.' });
            }
            const uId = new ObjectId(userId)
            const pId = new ObjectId(productId)

            const alreadyExists = await wishlistModel.findOne({ userId: uId, productId: pId });
            if (alreadyExists) {
                return responseReturn(res, 409, { message: 'Alredy added to wishlist.' });
            }

            await wishlistModel.create({
                userId,
                productId,
                name,
                price,
                delivery_charge,
                image,
                discount,
                rating,
                slug
            });

            return responseReturn(res, 201, { message: ' added to wishlist Successfully.' });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    };

    get_wishlist = async (req, res) => {
        const { userId } = req.params;

        try {
            if (!userId) {
                return responseReturn(res, 400)
            }
            const id = new ObjectId(userId) 

            const wishlist_products = await wishlistModel.find({ userId: id });
            const wishlist_product_count = await wishlistModel.find({ userId: id }).countDocuments();

            return responseReturn(res, 200, { wishlist_products, wishlist_product_count })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    remove_to_wishlist = async (req, res) => {
        const { userId, wishlistId } = req.body;

        try {
            if (!userId || !wishlistId) {
                return responseReturn(res, 400, { error: 'Some data is missing!. Please try again' });
            }
            const uId = new ObjectId(userId) 
            const wId = new ObjectId(wishlistId) 

            const deleted = await wishlistModel.deleteOne({ userId: uId, _id: wId })

            if (deleted.deletedCount === 0) {
                return responseReturn(res, 400, { error: 'Deleted failed!. Please try again' })
            }
            return responseReturn(res, 200, { message: 'Deleted successfuly' })


        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }



}

module.exports = new wishlistController();