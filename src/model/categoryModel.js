const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const categorySchema = new Schema({
    en_name: String,
    ru_name: String,
    image_url: String,
    image_name: String,
    meals: [{
        type: Schema.Types.ObjectId,
        ref: 'Meal'
    }]
})

categorySchema.plugin(mongoosePaginate)

exports.Category = model('Category', categorySchema)