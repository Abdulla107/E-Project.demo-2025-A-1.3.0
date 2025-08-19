const { Schema, model } = require('mongoose')

const shippingInfoSchema = new Schema({

     userId : {
        type : Schema.ObjectId,
        required : true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    shippingMethod: {
        type: String,
        required: true
    },

}, { timestamps: true })


module.exports = model('shipping_info', shippingInfoSchema)

