const { Meal } = require("../model/mealModel");

exports.gettingMealsFromOrder = async (array) => {
    const meals = await Promise.all(
        array.map(async (object) => {
            const meal = await Meal.findById(object.mealId)
            return {
                id: meal._id,
                en_name: meal.en_name,
                ru_name: meal.ru_name,
                price: meal.price,
                amount: object.amount,
            }
        })
    )

    return meals
}