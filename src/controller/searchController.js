const { Booking } = require("../model/bookingModel")
const { Category } = require("../model/categoryModel")
const { Meal } = require("../model/mealModel")
const { Order } = require("../model/orderModel")
const { errorHandling } = require("./errorController")
const { validationController } = require("./validationController")


exports.searchingCategory = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        const categories = await Category.find({
            $or: [
                { en_name: { $regex: data.key, $options: "i" } },
                { ru_name: { $regex: data.key, $options: "i" } }
            ]
        })

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Searching categories have been successfully.",
                categories
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.searchingMeals = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        const meals = await Meal.find({
            $or: [
                { en_name: { $regex: data.key, $options: "i" } },
                { ru_name: { $regex: data.key, $options: "i" } },
                { en_description: { $regex: data.key, $options: "i" } },
                { ru_description: { $regex: data.key, $options: "i" } }
            ]
        })

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Searching meals have been successfully.",
                meals
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.searchCustomer = async (req, res) => {
    const { query } = req
    try {
        // Result validation.
        const { error } = validationController(req, res)
        if (error) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Checking existence params.
        const customer_name = query.customer_name ? { customer_name: { $regex: query.customer_name, $options: "i" } } : false
        const email = query.email ? { email: { $regex: query.email, $options: "i" } } : false
        const phone = query.phone ? { phone: { $regex: query.phone, $options: "i" } } : false

        // Searching booking.
        const bookings = await Booking.find({
            ...customer_name, ...email, ...phone
        })

        // Searching order.
        const orders = await Order.find({
            ...customer_name, ...email, ...phone
        })

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Searching successfully.",
                bookings,
                orders
            }
        })
    }

    // Error handling
    catch (error) {
        errorHandling(error, res)
    }
}