const { Category } = require("../../model/categoryModel")
const { Meal } = require("../../model/mealModel")
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