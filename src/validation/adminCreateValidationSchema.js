exports.createAdminValidationSchema = {
    username: {
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: "Username cannot be empty!"
        },
        matches: {
            options: /^[a-zA-Z0-9]+$/,
            errorMessage: "Username can only contain letters and numbers (a-z, 0-9)!"
        },
        isLength: {
            options: { min: 3, max: 20 },
            errorMessage: "Username must be between 3 and 20 characters!"
        }
    },
    password: {
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: "Password cannot be empty!"
        },
        isLength: {
            options: { min: 4 },
            errorMessage: "Password must be at least 4 characters long!"
        }
    }
}