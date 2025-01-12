const { Schema, model } = require("mongoose");

const stolSchema = new Schema({
    number: Number,
    price: Number,
    capacity: Number
}, { timestamps: true })

exports.Stol = model('Stol', stolSchema)