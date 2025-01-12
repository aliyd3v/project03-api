const { Schema, model } = require("mongoose");

const bookingSchema = new Schema({
    customer_name: String,
    email: String,
    phone: String,
    date: String,
    time_start: String,
    time_end: String,
    is_active: Boolean,
    stol: { type: Schema.Types.ObjectId, ref: 'Stol' }
}, { timestamps: true })

exports.Booking = model('Booking', bookingSchema)