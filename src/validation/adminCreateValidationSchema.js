exports.createAdminValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty!"
        },
        isString: {
            errorMessage: "Usename must be a string!"
        },
        escape: true
    },
    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty!"
        },
        isString: {
            errorMessage: "Password must be a string!"
        },
        escape: true
    }
}