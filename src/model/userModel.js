const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
    username: String,
    password: String
})

exports.Admin = model('Admin', adminSchema)