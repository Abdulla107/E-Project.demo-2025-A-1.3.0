const { Schema, model } = require('mongoose')

const countrySchema = new Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },

})


module.exports = model('Target_country', countrySchema)