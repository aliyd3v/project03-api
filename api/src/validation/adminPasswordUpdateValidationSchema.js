exports.adminPasswordUdpateValidationSchema = {
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