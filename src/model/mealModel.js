const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

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

mealSchema.plugin(mongoosePaginate)

exports.Meal = model('Meal', mealSchema)