exports.queryEmailValidationSchema = {
    email: {
        in: ['query'],
        notEmpty: {
            errorMessage: 'Email is required!',
        },
        isEmail: {
            errorMessage: 'Email is not valid!',
        },
        normalizeEmail: true,
    },
}