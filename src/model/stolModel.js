const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = reqire('mongoose-paginate-v2')

const stolSchema = new Schema({
    number: Number,
    price: Number,
    capacity: Number
}, { timestamps: true })

stolSchema.plugin(mongoosePaginate)

exports.Stol = model('Stol', stolSchema)