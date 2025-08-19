const { Schema, model } = require('mongoose')

const myWalletSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, { timestamps: true })


module.exports = model('myWallets', myWalletSchema)