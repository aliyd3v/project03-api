const { Schema, model, plugin } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const adminSchema = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    phone: String,
    role: {
        type: String,
        enum: ['SUPERUSER', 'ADMIN'],
    }
})

adminSchema.plugin(mongoosePaginate)

exports.Admin = model('Admin', adminSchema)