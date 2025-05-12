exports.stolCreateValidationSchema = {
    number: {
        notEmpty: {
            errorMessage: "Stol number cannot be empty!"
        },
        isInt: {
            errorMessage: "Stol number must be a number"
        },
        escape: true
    },
    price: {
        notEmpty: {
            errorMessage: "Stol price cannot be empty!"
        },
        isInt: {
            errorMessage: "Stol price must be a number"
        },
        escape: true
    },
    capacity: {
        notEmpty: {
            errorMessage: "Stol capacity cannot be empty!"
        },
        isInt: {
            errorMessage: "Stol capacity must be a number"
        },
        escape: true
    }
}