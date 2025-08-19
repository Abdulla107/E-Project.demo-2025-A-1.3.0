const { Schema, model } = require('mongoose');

const joyentUserSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
})

module.exports = model('joyent_user', joyentUserSchema);