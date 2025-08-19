const { Schema, model } = require('mongoose')

const bannerSchema = new Schema({
    productId: {
        type: Schema.ObjectId,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
})

module.exports = model('banner', bannerSchema)
