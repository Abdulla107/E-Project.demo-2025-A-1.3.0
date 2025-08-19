const { Schema, model } = require('mongoose')

const customerOrder = new Schema({
    customerId : {
        type : Schema.ObjectId,
        required : true
    },
    products : {
        type : Array,
        required : true
    },
    total_price : {
        type : Number,
        required : true
    },
    payment_status : {
        type : String,
        required : true
    },
    refund : {
        type : String,
        default: ''
    },
    shippingInfo : {
        type : Object, 
        required : true
    },
    delivery_status : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
},{timestamps : true})

module.exports = model('customer_orders',customerOrder)