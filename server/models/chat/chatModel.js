const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    senderName: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    receverId: {     
        type: Schema.Types.ObjectId,
        default: null
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['not saw', 'saw'],
        default: "not saw"
    }

}, { timestamps: true })

module.exports = model('admin_user_messages', chatSchema)