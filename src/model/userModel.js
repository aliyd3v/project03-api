const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const adminSchema = new Schema({
    username: String,
    password: String
})

adminSchema.plugin(mongoosePaginate)

exports.Admin = model('Admin', adminSchema)