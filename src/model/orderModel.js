const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const orderSchema = new Schema({
    customer_name: String,
    email: String,
    phone: String,
    status: {
        type: String,
        enum: ['Delivered', 'Cooking', 'On way', 'Wait accept'],
    },
    meals: [{
        meal: Object,
        amount: Number
    }]
}, { timestamps: true })

orderSchema.plugin(mongoosePaginate)

exports.Order = model('Order', orderSchema)