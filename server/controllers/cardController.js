const cardModel = require('../models/cardModel')
const { responseReturn } = require('../utiles/response')
const { mongo: { ObjectId } } = require('mongoose');



class cardController {

    add_to_card = async (req, res) => {
        const { userId, productId, quantity, delivery_charge } = req.body;

        try {
            const uId = new ObjectId(userId) 
            const pId = new ObjectId(productId) 

            const product = await cardModel.findOne({ userId: uId, productId: pId});

            if (product) {
                return responseReturn(res, 404, { error: 'Alredy added to card' })
            } else {
                const product = await cardModel.create({
                    userId,
                    productId,
                    quantity,
                    delivery_charge
                })
                return responseReturn(res, 201, { product, message: 'Add to card successful' })
            }

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }




    get_card_products = async (req, res) => {
        const { userId } = req.params;

        try {
            if (!userId) {
                return responseReturn(res, 404, { error: 'User ID is required' });
            }

            const card_products = await cardModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId),
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "products",
                    },
                },
            ]);

            let buy_product_item = 0;
            let calculatePrice = 0;
            let card_product_count = 0;
            let shipping_fee = 0;

            const outOfStockProduct = card_products.filter(p => {
                if (!p.products || p.products.length === 0) return false;
                const stock = Number(p.products[0].stock);
                const quantity = Number(p.quantity);
                return stock < quantity;
            });

            for (const item of outOfStockProduct) {
                card_product_count += Number(item.quantity);
            }

            const stockProduct = card_products.filter(p => {
                if (!p.products || p.products.length === 0) return false;
                const stock = Number(p.products[0].stock);
                const quantity = Number(p.quantity);
                return stock >= quantity;
            });

            let productList = [];

            for (const item of stockProduct) {
                const { quantity, delivery_charge, products, _id } = item;

                if (!products || products.length === 0) continue;

                const product = products[0];
                const { price, discount = 0 } = product;

                const unitPrice = price - (price * discount) / 100;
                const productTotal = unitPrice * quantity;

                card_product_count += quantity;
                buy_product_item += quantity;
                shipping_fee += delivery_charge * quantity;
                calculatePrice += productTotal;


                productList.push({
                    _id,
                    quantity,
                    delivery_charge,
                    productInfo: product,
                });
            }


            return responseReturn(res, 200, {
                card_products: productList,
                price: parseFloat(calculatePrice.toFixed(2)),
                card_product_count,
                shipping_fee,
                outOfStockProduct,
                buy_product_item,
            });

        } catch (error) {
            return responseReturn(res, 500, { error: "Server error" });
        }
    };




    quantity_inc = async (req, res) => {

        const { productId, temp } = req.body;

        try {
            if (!productId || !temp) {
                return responseReturn(res, 400, { error: 'Data undifind. Please try again' })
            }
            const _id = new ObjectId(productId) 

            await cardModel.findByIdAndUpdate(_id, { quantity: temp }, { new: true }) 

            return responseReturn(res, 200, { message: 'quantity +' })
        } catch (error) {
            return responseReturn(res, 500, { error: 'server error' })
        }
    }
    quantity_dec = async (req, res) => {

        const { productId, temp } = req.body;

        try {
            if (!productId || !temp) {
                return responseReturn(res, 400, { error: 'Data undifind. Please try again' })
            }
            const _id = new ObjectId(productId) 

            await cardModel.findByIdAndUpdate(_id, { quantity: temp }, { new: true }) 

            return responseReturn(res, 200, { message: 'quantity -' })
        } catch (error) {
            return responseReturn(res, 500, { error: 'server error' })
        }
    }

    delete_card_product = async (req, res) => {
        const { productId } = req.params;

        try {
            if (!productId) {
                return responseReturn(res, 400, { error: 'Delete failed. Please try again' })
            }
            const _id = new ObjectId(productId) 

            await cardModel.findOneAndDelete(_id) 
            return responseReturn(res, 200, { message: 'Deleted successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: 'server error' })
        }
    }




}

module.exports = new cardController()
