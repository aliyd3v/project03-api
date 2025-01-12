exports.categoryUpdateValidationSchema = {
    en_name: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Category name cannot be empty!"
        },
        isString: {
            errorMessage: "Category name must be string!"
        },
        escape: true
    },
    ru_name: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Category name cannot be empty!"
        },
        isString: {
            errorMessage: "Category name must be string!"
        },
        escape: true
    },
    file: {
        custom: {
            options: (value, { req }) => {
                const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (req.file) {
                    if (!validMimeTypes.includes(req.file.mimetype)) {
                        throw new Error('Image must be only JPEG, PNG, GIF, WEBP format!');
                    }
                }
                return true;
            },
        },
    }
}