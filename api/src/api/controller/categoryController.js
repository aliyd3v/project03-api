const { errorHandling } = require("./errorController")
const { Category } = require("../../model/categoryModel")
const { idChecking } = require("./idController")
const { Meal } = require("../../model/mealModel")

exports.getAllCategories = async (req, res) => {
    try {
        // Getting all categories from database.
        const categories = await Category.find().populate('meals')

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Getting all categories successfully.",
                categories
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getOneCategory = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Searching category with id.
        const category = await Category.findById(id).populate('meals')

        // Checking category for existence.
        if (!category) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Category is not found!" }
            })
        }

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Category has been getted successful.",
                category
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getCategoryMeals = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Searching category with id.
        const category = await Category.findById(id)

        // Checking category for existence.
        if (!category) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Category is not found!" }
            })
        }

        // Getting all meals in selected category.
        const meals = await Meal.find({ category: category._id })

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: `Meals in category ${category.en_name} (${category.ru_name}) has been getted successful.`,
                meals
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}