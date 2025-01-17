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
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required!',
        },
        isEmail: {
            errorMessage: 'Email is not valid!',
        },
        normalizeEmail: true,
    },
    phone: {
        notEmpty: {
            errorMessage: 'Phone number is required!',
        },
        matches: {
            options: [/^(\+998|998|0)?[3-9]\d{8}$/],
            errorMessage: 'Phone number is not valid!',
        },
    },
}