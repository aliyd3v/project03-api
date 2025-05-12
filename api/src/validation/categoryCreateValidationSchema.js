exports.categoryCreateValidationSchema = {
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