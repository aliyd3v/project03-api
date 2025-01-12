exports.searchCustomerValidatorSchema = {
    customer_name: {
        in: ['query'],
        optional: true,
        isString: {
            errorMessage: 'Customer name must be a string.',
        },
        escape: true,
    },
    email: {
        in: ['query'],
        trim: true,
        escape: true
    },
    phone: {
        in: ['query'],
        escape: true,
        trim: true
    }
}
