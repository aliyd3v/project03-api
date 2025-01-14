const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = reqire('mongoose-paginate-v2')

const orderSchema = new Schema({
    customer_name: String,
    email: String,
    phone: String,
    status: {
        type: String,
        enum: ['Delivered', 'Pending'],
    },
    meals: [{
        mealId: String,
        amount: Number
    }]
}, { timestamps: true })

orderSchema.plugin(mongoosePaginate)

exports.Order = model('Order', orderSchema)