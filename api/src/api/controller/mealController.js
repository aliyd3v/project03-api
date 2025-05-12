const { Meal } = require("../../model/mealModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")

exports.getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find().populate('category')
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Getting all meals is successful.",
                meals
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getOneMeal = async (req, res) => {
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

        // Checking meal to exists.
        const meal = await Meal.findById(id).populate('category')
        if (!meal) {
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Meal is not found!" }
            })
        }

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Meal has been getted successful.",
                meal
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}