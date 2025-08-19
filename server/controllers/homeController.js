const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const reviewModel = require('../models/reviewModel');
const queryProducts = require('../utiles/queryProducts');
const { responseReturn } = require('../utiles/response')
const moment = require('moment')
const { mongo: { ObjectId } } = require('mongoose')


class homeController {

    formateProduct = (products) => {
        const productArray = [];
        let i = 0;
        while (i < products.length) {
            let temp = [];
            let j = i;
            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j]);
                }
                j++;
            }
            productArray.push([...temp]);
            i = j;
        }
        return productArray;
    };


    get_products = async (req, res) => {

        try {
            const products = await productModel
                .find({})
                .limit(12)
                .sort({ createdAt: -1 });


            responseReturn(res, 200, { products });
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };


    price_range_product = async (req, res) => {

        try {
            const priceRange = { low: 0, high: 0, };
            const getForPrice = await productModel.find({}).sort({ price: 1, });

            if (getForPrice.length > 0) {
                priceRange.high = getForPrice[getForPrice.length - 1].price;
                priceRange.low = getForPrice[0].price;
            }

            responseReturn(res, 200, { priceRange });
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };



    query_products = async (req, res) => {
        const parPage = 12;
        req.query.parPage = parPage;

        try {
            const products = await productModel.find({}).sort({ createdAt: -1 });

            const productQuery = new queryProducts(products, req.query)
                .categoryQuery()
                .searchQuery()
                .priceQuery()
                .ratingQuery()
                .sortByPrice();

            const totalProduct = productQuery.countProducts();

            const result = productQuery
                .paginate()
                .getProducts();


            responseReturn(res, 200, {
                products: result,
                totalProduct,
                parPage
            });

        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };

    get_productDetails = async (req, res) => {
        const { productId } = req.params;

        try {
            if (!productId) {
                return responseReturn(res, 400);
            }
            const _id = new ObjectId(productId) 

            const product = await productModel.findById(_id); 

            if (!product) {
                return responseReturn(res, 404, { error: 'Product not found' });
            }

            const related = await productModel.find({ category: product.category });

            const relatedProducts = related.filter(p => p._id.toString() !== product._id.toString());

            return responseReturn(res, 200, { product, relatedProducts });

        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };


    add_customer_review = async (req, res) => {
        const { name, review, rating, productId } = req.body;

        try {
            if (!name || !review || !productId) {
                return responseReturn(res, 400)
            }
            const data = await reviewModel.create({
                name,
                review,
                rating,
                productId,
                date: moment(Date.now()).format('LL')
            })

            if (!data) {
                return responseReturn(res, 400, { error: 'Review failed' })
            }

            // call update rating function
            this.update_rating(productId)

            return responseReturn(res, 200, { message: 'Review successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }


    update_rating = async (productId) => {

        try {
            if (!productId) return

            const reviews = await reviewModel.find(
                { productId: new ObjectId(productId) },
                { 'rating': 1, '_id': 0 })

            if (!reviews) return;

            const totalRatings = reviews.reduce((sum, review) => {
                return sum + review.rating;
            }, 0);

            let averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;
            averageRating = Math.round(averageRating * 2) / 2;
            if (averageRating > 5) averageRating = 5;


            await productModel.updateOne(
                { _id: new ObjectId(productId) },
                { $set: { rating: averageRating } })


        } catch (error) {
            return
        }
    };




    get_reviews = async (req, res) => {
        const { productId } = req.params;
        let { pageNo } = req.query;
        pageNo = parseInt(pageNo) || 1;

        const limit = 7;
        const skipPage = limit * (pageNo - 1);

        try {
              const id = new ObjectId(productId); 
 
            const getRating = await reviewModel.aggregate([
                {
                    $match: {
                        productId: id, 
                        rating: { $not: { $size: 0 } },
                    },
                },
                { $unwind: "$rating" },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        rating: "$_id",
                        sum: "$count"
                    }
                }
            ]);

            const rating_review = [5, 4, 3, 2, 1].map((rating) => {
                const found = getRating.find((r) => r.rating === rating);
                return { rating, sum: found ? found.sum : 0 };
            });
          
            const totalReview = await reviewModel.countDocuments({ productId: id }); 

            const reviews = await reviewModel 
                .find({ productId: id })
                .skip(skipPage)
                .limit(limit)
                .sort({ createdAt: -1 });

            responseReturn(res, 200, {
                reviews,
                totalReview,
                rating_review,
                parPage: limit,
            });
        } catch (error) {
            responseReturn(res, 500, { error: "Something went wrong while fetching reviews." });
        }
    };


    review_authorise = async (req, res) => {
        const { productId } = req.params;
        let { customerId } = req.query;


        try {
            if (!productId || !customerId) {
                return responseReturn(res, 400)
            }

            const author = await orderModel.exists({
                customerId: new ObjectId(customerId),
                payment_status: "paid",
                "products.productInfo._id": productId 
            });

            if (author) {
                return res.status(200).json(true)
            }
            if (!author) {
                return res.status(200).json(false)
            }

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }






}

module.exports = new homeController();