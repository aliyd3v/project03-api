const { Schema, model } = require("mongoose");

const tokenStoreSchema = new Schema({
    nonce: String
}, { timestamps: true })

exports.TokenStore = model('TokenStore', tokenStoreSchema)