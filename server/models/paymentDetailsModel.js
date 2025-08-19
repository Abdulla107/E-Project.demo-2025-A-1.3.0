const { Schema, model } = require('mongoose');

const paymentDetailsSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = model('paymentDetails', paymentDetailsSchema);
