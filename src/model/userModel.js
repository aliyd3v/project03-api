const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = reqire('mongoose-paginate-v2')

const adminSchema = new Schema({
    username: String,
    password: String
})

adminSchema.plugin(mongoosePaginate)

exports.Admin = model('Admin', adminSchema)