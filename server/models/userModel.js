const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    koscen: {
        type: String,
        required: true,
        select: false
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: 'user'
    },
    date: {
        type: String,
        default: ''
    }
},{ timestamps: true })

module.exports = model('users', userSchema)