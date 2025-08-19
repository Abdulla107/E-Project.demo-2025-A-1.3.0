const { Schema, model } = require('mongoose');

const wishlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    delivery_charge: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, { timestamps: true });


wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = model('wishlist_products', wishlistSchema);
