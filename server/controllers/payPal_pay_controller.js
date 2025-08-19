const paymentDetailsModel = require('../models/paymentDetailsModel');
const orderModel = require('../models/orderModel');
const myWalletModel = require('../models/myWalletModel');
const paypal = require('paypal-rest-sdk');
require('dotenv').config();

const api_B = require('./../api/api_B')
const api_F = require('./../api/api_F')

const moment = require('moment')
const { responseReturn } = require('../utiles/response');
const { mongo: { ObjectId } } = require('mongoose')



paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});


class paymentController {

    createPayment = async (req, res) => {
        const { amount, orderId, customerId } = req.body;

        try {

            if (!amount || !orderId || !customerId) {
                return res.redirect(`${api_F}/payment/failed`);
            }

            //  Create payment data
            const paymentData = {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal',
                },
                redirect_urls: {
                    return_url: `${api_B}/api/paypal/success?amount=${amount}&orderId=${orderId}&customerId=${customerId}`,
                    cancel_url: `${api_B}/api/paypal/cancel`,
                },
                transactions: [{
                    amount: {
                        currency: 'USD',
                        total: amount,
                    },
                }]
            };

            //  Create PayPal payment
            paypal.payment.create(paymentData, (error, payment) => {
                if (error) {
                    return res.status(500).json({ error: 'PayPal payment creation failed' });
                }

                const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
                if (approvalUrl) {
                    res.json({ approvalUrl: approvalUrl.href });
                } else {
                    res.status(500).json({ error: 'Approval URL not found' });
                }
            });

        } catch (error) {
            return responseReturn(res, 500, {error: 'Internal server error'})
        }
    };



    executePayment = async (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const { amount, orderId, customerId } = req.query;


        if (!amount || !orderId || !customerId) {
            return res.redirect(`${api_F}/payment/failed`);
        }


        const executeData = {
            payer_id: payerId,
        };


        paypal.payment.execute(paymentId, executeData, async (error, payment) => {
            if (error) {
                return res.redirect(`${api_F}/payment/failed`);
            }

            try {
                const transactionId = payment.transactions[0].related_resources[0].sale.id;

                // payment_status_update funciton-col
                this.payment_status_update(amount, orderId, transactionId, customerId)

                return res.redirect(`${api_F}/payment/success/${orderId}/${customerId}`);

            } catch (err) {
                return res.redirect(`${api_F}/payment/failed`);
            }
        });
    };

    cancelPayment = (req, res) => {
        res.redirect(`${api_F}/payment/failed`);
    };


    payment_status_update = async (amount, orderId, transactionId, customerId) => {

        try {

            if (transactionId) {
                await paymentDetailsModel.create({
                    amount,
                    customerId,
                    orderId,
                    transactionId,
                    date: moment(Date.now()).format('LLL')
                });

                const id = new ObjectId(orderId) 
                await orderModel.findByIdAndUpdate(id, { 
                    payment_status: "paid",
                    delivery_status: "Pending",
                }, { new: true });


                // col wllet_payment_configer
                this.wallet_payment_configer(amount, orderId)
            }

        } catch (error) {
             return responseReturn(res, 500, { error: 'server error' })
        }
    };

    wallet_payment_configer = async (amount, orderId) => {


        try {

            const time = moment(Date.now()).format('l')
            const splitTime = time.split('/')

            // save shipping wallet transaction 
            await myWalletModel.create({
                orderId,
                amount,
                month: splitTime[0],
                year: splitTime[2],
            })


        } catch (error) {
             return responseReturn(res, 500, { error: 'server error' })
        }
    }



}

module.exports = new paymentController();
