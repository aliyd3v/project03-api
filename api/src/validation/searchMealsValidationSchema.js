exports.searchMealsValidatorSchema = {
    key: {
        optional: true,
        isString: {
            errorMessage: 'Key must be a string.',
        },
        escape: true,
    }
}