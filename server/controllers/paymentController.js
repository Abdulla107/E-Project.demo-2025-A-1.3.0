const orderModel = require("../models/orderModel");
const paymentDetailsModel = require("../models/paymentDetailsModel");
const refundModel = require("../models/refundModel");
const { responseReturn } = require("../utiles/response");
const { mongo: { ObjectId } } = require('mongoose')
const { client, paypal } = require('../utiles/paymentClient')
const moment = require('moment');
const myWalletModel = require("../models/myWalletModel");

class paymentController {

    customer_refund_request = async (req, res) => {
        const { orderId } = req.params;

        try {
            if (!orderId) {
                return responseReturn(res, 400, { error: 'Refund request failed' })
            }
            const id = new ObjectId(orderId)
            const order = await orderModel.findById(id)

            if (order.payment_status !== 'paid') {
                return responseReturn(res, 400, { error: 'Order not found' })
            }

            const refund = await refundModel.find({ orderId: id })
            if (refund.orderId) {
                return responseReturn(res, 400, { error: 'Sorry, your request cannot be accepted' })
            }

            await refundModel.create({
                orderId: order._id,
                amount: order.total_price,
                refund: 'Request',
                date: moment(Date.now()).format('LLL')

            })

            await orderModel.findByIdAndUpdate(
                id, { refund: 'Request' }, { new: true }
            )
            return responseReturn(res, 200, { message: 'Refund request successfuly' })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }



    admin_update_refund_status = async (req, res) => {
        const { orderId, refund_status } = req.body;

        try {
            if (!orderId || !refund_status) {
                return responseReturn(res, 400, { error: 'Refund status update failed' })
            }

            const id = new ObjectId(orderId) 
            const order = await orderModel.findById(id)

            if (!order) {
                return responseReturn(res, 400, { error: 'Order not found' })
            }


            if (refund_status === 'Cancelled') {
                await orderModel.findOneAndUpdate(
                    id,
                    { refund: refund_status,}, { new: true }
                )
                await refundModel.findOneAndUpdate(
                    { orderId: id },
                    {
                        refund: refund_status,
                        date: moment(Date.now()).format('LLL')
                    }
                )
                return responseReturn(res, 200, { message: 'Refund Cancelled successfuly' })
            }

            if (refund_status === 'Accepted') {

                if (order.payment_status !== 'paid' && order.total_price) {
                    return responseReturn(res, 400, { error: 'Refund not accepted' })
                }

                const payment_details = await paymentDetailsModel.findOne({ orderId: id })
                if (!payment_details || !payment_details.transactionId) {
                    return responseReturn(res, 400, { error: 'Transaction Id not foud' })
                }

                const captureId = payment_details.transactionId;

                const getRequest = new paypal.payments.CapturesGetRequest(captureId); 
                const getResponse = await client().execute(getRequest);
                const totalCaptured = getResponse.result.amount.value;
                const alreadyRefunded = getResponse.result.refunded_amount?.value || "0.00";
                const remainingAmount = (parseFloat(totalCaptured) - parseFloat(alreadyRefunded)).toFixed(2);

                
                const amount = order.total_price

                if (parseFloat(remainingAmount) < parseFloat(amount)) {
                    return responseReturn(res, 400, { error: "This payment is already fully refunded." });
                }

                const refundRequest = new paypal.payments.CapturesRefundRequest(captureId);
                refundRequest.requestBody({
                    amount: {
                        value: amount,
                        currency_code: "USD"
                    }
                });

                const refundResponse = await client().execute(refundRequest);

                if(refundResponse.statusCode !== 201){
                    return responseReturn(res, 400, {error: 'Payment refunde failed'})
                }

                const transactionId = refundResponse.result.id;

                await orderModel.findByIdAndUpdate(id, {
                    delivery_status: 'Refunded',
                    payment_status: 'Refunded',
                    refund: 'Accepted'
                });

                await refundModel.findOneAndUpdate(
                    { orderId: id }, { refund: 'Accepted', transactionId, date: moment(Date.now()).format('LLL') }
                )

                await myWalletModel.findOneAndDelete({ orderId: id })

                return responseReturn(res, 200, { message: 'Refund accepted successfully' })
            }

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    admin_get_refund_details = async (req, res) => {

        try {
            const refund_request = await refundModel.find({ refund: 'Request' }).sort({ createdAt: -1 });
            const refund_cancelled = await refundModel.find({ refund: 'Cancelled' }).sort({ createdAt: -1 });

            return responseReturn(res, 200, { refund_request, refund_cancelled });

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }

    admin_get_payment_details = async (req, res) => {

        try {
            const refund_details = await refundModel.find({ refund: 'Accepted' }, { _id: 0 }).sort({ createdAt: -1 });
            const transactions = await paymentDetailsModel.find({}, { customerId: 0, _id: 0 }).sort({ createdAt: -1 });

            return responseReturn(res, 200, { refund_details, transactions })

        } catch (error) {
            return responseReturn(res, 500, { error: error.message })
        }
    }




}

module.exports = new paymentController();