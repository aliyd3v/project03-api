exports.searchMealsValidatorSchema = {
    key: {
        in: ['query'],
        optional: true,
        isString: {
            errorMessage: 'Key must be a string.',
        },
        escape: true,
    }
}