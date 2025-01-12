const { Schema, model } = require("mongoose");

const mealSchema = new Schema({
    en_name: String,
    ru_name: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    en_description: String,
    ru_description: String,
    price: Number,
    image_url: String,
    image_name: String
})

exports.Meal = model('Meal', mealSchema)