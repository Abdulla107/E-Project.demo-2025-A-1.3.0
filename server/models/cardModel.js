const { Schema, model } = require('mongoose')

const cardSchema = new Schema({
    userId : {
        type : Schema.ObjectId,
        required : true
    },
    productId : {
        type : Schema.ObjectId,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    delivery_charge : {
        type : Number,
        required : true
    }
},{timestamps : true})

module.exports = model('card_products',cardSchema)