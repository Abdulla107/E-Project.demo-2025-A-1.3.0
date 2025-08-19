const { Schema, model } = require('mongoose');

const refundSchema = new Schema({
    orderId: {
        type: Schema.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    refund: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = model('refund_details', refundSchema);