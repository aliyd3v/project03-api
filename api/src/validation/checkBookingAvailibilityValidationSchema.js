exports.checkBookingAvailabilityValidationSchema = {
    date: {
        notEmpty: {
            errorMessage: "Date cannot be empty!"
        },
        matches: {
            options: [/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/],
            errorMessage: 'Date format is wrong! True format: yyyy-MM-dd',
        },
        escape: true
    },
    time: {
        notEmpty: {
            errorMessage: "Time cannot be empty!"
        },
        matches: {
            options: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/], // Format: HH:mm
            errorMessage: 'Time format is wrong!. True format: HH:mm',
        },
        escape: true
    },
    hour: {
        notEmpty: {
            errorMessage: "Hour(s) cannot be empty!"
        },
        isInt: {
            errorMessage: 'Hour(s) must be a number!',
        },
        escape: true
    }
}