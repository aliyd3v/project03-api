exports.mealCreateValidationSchema = {
    en_name: {
        notEmpty: {
            errorMessage: "Name a meal cannot be empty!"
        },
        isString: {
            errorMessage: "Name a meal must be a string!"
        },
        escape: true
    },
    ru_name: {
        notEmpty: {
            errorMessage: "Name a meal cannot be empty!"
        },
        isString: {
            errorMessage: "Name a meal must be a string!"
        },
        escape: true
    },
    en_description: {
        notEmpty: {
            errorMessage: "Description a meal cannot be empty!"
        },
        isString: {
            errorMessage: "Description a meal must be a string!"
        },
        escape: true
    },
    ru_description: {
        notEmpty: {
            errorMessage: "Description a meal cannot be empty!"
        },
        isString: {
            errorMessage: "Description a meal must be a string!"
        },
        escape: true
    },
    price: {
        notEmpty: {
            errorMessage: "Price a meal cannot be empty!"
        },
        isInt: {
            errorMessage: "Price a meal must be a number"
        },
        escape: true
    },
    category: {
        notEmpty: {
            errorMessage: "Category a meal cannot be unselected!"
        },
        isMongoId: {
            errorMessage: "Category is wrong!"
        },
        escape: true
    },
    file: {
        custom: {
            options: (value, { req }) => {
                if (!req.file) {
                    throw new Error('Image is required!');
                }
                const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validMimeTypes.includes(req.file.mimetype)) {
                    throw new Error('Image must be only JPEG, PNG, GIF, WEBP format!');
                }
                return true;
            },
        },
    }
}