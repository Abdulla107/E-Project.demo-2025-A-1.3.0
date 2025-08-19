const orderModel = require("../models/orderModel");
const shippingInfoModel = require("../models/shippingInfoModel");
const cardModel = require('../models/cardModel')
const { responseReturn } = require("../utiles/response");
const moment = require('moment')
const { mongo: { ObjectId } } = require('mongoose')


class orderController {

    add_shipping_info = async (req, res) => {
        const { userId, fullName, email, phone, address, city, district, postalCode, country, shippingMethod } = req.body

        try {
            if (!userId || !fullName || !email || !phone || !address || !city || !district || !postalCode || !country || !shippingMethod) {
                return responseReturn(res, 400, { message: 'All fields are required' });
            }
            const id = new ObjectId(userId) 

            const shippingInfo = await shippingInfoModel.findOne({ userId: id })

            if (shippingInfo) {
                const update = await shippingInfoModel.findOneAndUpdate(
                    { userId: id },
                    {
                        $set: {
                            fullName,
                            email,
                            phone,
                            address,
                            city,
                            district,
                            postalCode,
                            country,
                            shippingMethod
                        }
                    },
                    { new: true }

                )
                return responseReturn(res, 201, { update, message: 'Update successful' })
            } else {

                const add = await shippingInfoModel.create({
                    userId,
                    fullName,
                    email,
                    phone,
                    address,
                    city,
                    district,
                    postalCode,
                    country,
                    shippingMethod

                })

                return responseReturn(res, 201, { add, message: 'add successful' })
            }


        } catch (error) {
            return responseReturn(res, 500, { error: "Server error" });
        }

    };

    get_shipping_info = async (req, res) => {
        const { userId } = req.params

        try {
            if (!userId) {
                return responseReturn(res, 400)
            }
            const id = new ObjectId(userId) 

            const shippingInfo = await shippingInfoModel.findOne({ userId: id })

            return responseReturn(res, 200, { shippingInfo })

        } catch (error) {
            return responseReturn(res, 500, { error: "Server error" });
        }
    }

    place_order = async (req, res) => {
        const { products, total_price, shippingInfo, customerId } = req.body;


        try {
            if (!products || !total_price || !shippingInfo || !customerId) {
                return responseReturn(res, 400, { error: 'Failed. Please try again' })
            }

            const tempDate = moment(Date.now()).format("LLL");
            const order = await orderModel.create({
                customerId,
                products,
                total_price,
                shippingInfo,
                payment_status: 'unpaid',
                delivery_status: 'Pending',
                date: tempDate
            })

            if (!order) {
                return responseReturn(res, 400, { error: 'Order failed' })
            }
            const id = new ObjectId(customerId)
            await cardModel.deleteMany({ userId: id })
            this.payment_check(order._id)

            return responseReturn(res, 200, { order, message: 'Order successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: 'Server error' })
        }

    };

    payment_check = async (orderId) => {

        try {
            if (!orderId) {
                return responseReturn(res, 400)
            }
            const _id = new ObjectId(orderId) 

            setTimeout(async () => {

                const order = await orderModel.find({ _id, payment_status: 'unpaid' }) 

                if (order) {
                    await orderModel.findByIdAndUpdate(_id, { 
                        delivery_status: "Cancelled",
                    }, { new: true });


                }

            }, 3000);

        } catch (error) {
            return responseReturn(res, 500, { error: 'server error' })
        }

    }

    get_deshboard_orders = async (req, res) => {
        const { userId } = req.params;

        try {
            if (!userId) {
                return responseReturn(res, 400)
            }
            const id = new ObjectId(userId) 

            const new_orders = await orderModel.find({ customerId: id }).sort({ createdAt: -1 }).limit(8)
            const total_order = await orderModel.find({ customerId: id }).countDocuments()
            const pending_order = await orderModel.find({ customerId: id, delivery_status: 'Pending' }).countDocuments()
            const unpaid_order = await orderModel.find({ customerId: id, payment_status: 'unpaid' }).countDocuments()

            return responseReturn(res, 200, { new_orders, total_order, pending_order, unpaid_order })

        } catch (error) {
            return responseReturn(res, 500, { error: 'server error ' })
        }


    }

    get_orders = async (req, res) => {
        const { userId, status } = req.query;

        try {
            if (!userId) {
                return responseReturn(res, 400)
            }
            const id = new ObjectId(userId) 

            if(status === 'All'){
                const orders = await orderModel.find({ customerId: id }).sort({ createdAt: -1 });
                return responseReturn(res, 200, { orders })
            }

            const orders = await orderModel.find({ customerId: id, delivery_status: status}).sort({ createdAt: -1 })
            return responseReturn(res, 200, {orders})

        } catch (error) {
            return responseReturn(res, 500, { error: 'server error' })
        }
    };


    get_order = async (req, res) => {
        const { orderId } = req.params;

        try {
            if (!orderId) {
                return responseReturn(res, 400)
            }
            const _id = new ObjectId(orderId) 
            const order = await orderModel.findById(_id) 

            return responseReturn(res, 200, { order })

        } catch (error) {
            return responseReturn(res, 500, { error: 'server error' })
        }
    }

    admin_get_orders = async (req, res) => {

        try {

            const running_orders = await orderModel.find({ delivery_status: { $nin: ['Delivered', 'Cancelled', 'Refunded'] }})

            const completed_orders = await orderModel.find({ delivery_status: 'Delivered' })
            const cancelled_orders = await orderModel.find({ delivery_status: 'Cancelled' })
            const refunded_orders = await orderModel.find({ delivery_status: 'Refunded' })

            return responseReturn(res, 200, { running_orders, completed_orders, cancelled_orders, refunded_orders })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    admin_get_order = async (req, res) => {
        const { orderId } = req.params;

        try {
            if (!orderId) return;
            
            const _id = new ObjectId(orderId) 
            const order = await orderModel.findById(_id) 
            return responseReturn(res, 200, { order })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    admin_update_order_status = async (req, res) => {
        const { delivery_status, orderId } = req.body;

        try {
            if (!orderId || !delivery_status) {
                return responseReturn(res, 400, { error: 'Status update failed' })
            }

            const _id = new ObjectId(orderId) 
            await orderModel.findByIdAndUpdate(_id, { delivery_status }, { new: true })
            return responseReturn(res, 200, { message: 'Status Update Successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    };


}

module.exports = new orderController();