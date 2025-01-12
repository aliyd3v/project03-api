exports.mealUpdateValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "Name a meal cannot be empty!"
        },
        isString: {
            errorMessage: "Name a meal must be a string!"
        },
        escape: true
    },
    description: {
        notEmpty: {
            errorMessage: "Description a meal cannot be empty!"
        },
        isString: {
            errorMessage: "Description a meal must be a string!"
        },
        escape: true
    },
    price: {
        notEmpty: {
            errorMessage: "Price a meal cannot be empty!"
        },
        isInt: {
            errorMessage: "Price a meal must be a number"
        },
        escape: true
    },
    category: {
        notEmpty: {
            errorMessage: "Category a meal cannot be unselected!"
        },
        isMongoId: {
            errorMessage: "Category is wrong!"
        },
        escape: true
    }
}