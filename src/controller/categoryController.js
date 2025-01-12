const { errorHandling } = require("./errorController")
const { Category } = require("../model/categoryModel")
const fs = require('fs')
const { idChecking } = require("./idController")
const { uploadImage, getImageUrl, deleteImage } = require("./imageConroller")
const { validationController } = require("./validationController")
const { Meal } = require("../model/mealModel")

exports.categoryPage = (req, res) => {
    try {
        return res.render('category', {
            layout: false,
            categoryPage: true
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createCategory = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        // Registration path and name of file.
        const filePath = req.file.path
        const fileName = req.file.filename

        // Checking name for existence. (If exists responsing error.)
        const condidat = await Category.findOne({
            $or: [
                { en_name: data.en_name },
                { ru_name: data.ru_name }
            ]
        })
        if (condidat) {
            fs.unlinkSync(filePath)
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: `Already exists category with current name (en or ru).` }
            })
        }

        // Uploading image to supabse storage and get image url.
        const { errorSupabase } = await uploadImage(fileName, filePath)
        if (errorSupabase) {
            fs.unlinkSync(filePath)
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: { message: 'Error uploading image!' }
            })
        }
        const { publicUrl } = await getImageUrl(fileName, filePath)
        fs.unlinkSync(filePath)

        // Writing new category to database.
        const newCategory = await Category.create({
            en_name: data.en_name,
            ru_name: data.ru_name,
            image_url: publicUrl,
            image_name: fileName
        })

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Category has been created successfully."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        // Getting all categories from database.
        const categories = await Category.find()

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Getting all categories successfully.",
                categories
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getOneCategory = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Searching category with id.
        const category = await Category.findById(id)

        // Checking category for existence.
        if (!category) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Category is not found!" }
            })
        }

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Category has been getted successful.",
                category
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getCategoryMeals = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Searching category with id.
        const category = await Category.findById(id)

        // Checking category for existence.
        if (!category) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Category is not found!" }
            })
        }

        // Getting all meals in selected category.
        const meals = await Meal.find({ category: category._id })

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: `Meals in category ${category.en_name} (${category.ru_name}) has been getted successful.`,
                meals
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateOneCategory = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Checking category for existence.
        const category = await Category.findById(id)
        if (!category) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }

            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Category is not found!" }
            })
        }

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            return res.status(400).send({
                success: false,
                data: null,
                error: {
                    message: error
                }
            })
        }

        if (!req.file) {
            if (category.en_name != data.en_name || category.ru_name != data.ru_name) {
                // Checking name for exists. (If exists responsing error.)
                const condidat = await Category.findOne({
                    $or: [
                        { en_name: data.en_name },
                        { ru_name: data.ru_name }
                    ]
                })
                if (condidat) {
                    if (condidat._id != id) {
                        // Responding.
                        return res.status(400).send({
                            success: false,
                            data: null,
                            error: { message: `Already exists category with name (en or ru).` }
                        })
                    }
                }

                // Writing to database.
                category.en_name = data.en_name
                category.ru_name = data.ru_name
                await Category.findByIdAndUpdate(id, category)
            }
        } else {
            // Registration path and name of file.
            const filePath = req.file.path
            const fileName = req.file.filename

            // Checking name for exists. (If exists responsing error.)
            const condidat = await Category.findOne({
                $or: [
                    { en_name: data.en_name },
                    { ru_name: data.ru_name }
                ]
            })
            if (condidat._id != id) {
                fs.unlinkSync(filePath)
                // Responding.
                return res.status(400).send({
                    success: false,
                    data: null,
                    error: { message: `Already exists category with name (en or ru).` }
                })
            }

            // Delete old image of category.
            deleteImage(category.image_name)

            // Uploading image to supabse storage and get image url.
            await uploadImage(fileName, filePath)
            const { publicUrl } = await getImageUrl(fileName, filePath)
            fs.unlinkSync(filePath)

            // Writing to database.
            category.en_name = data.en_name
            category.ru_name = data.ru_name
            category.image_url = publicUrl
            category.image_name = fileName
            const updateCategory = await Category.findByIdAndUpdate(id, category)
        }

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Category has been updated successfully."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteOneCategory = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Checking category for existence.
        const category = await Category.findById(id)
        if (!category) {
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Category is not found!" }
            })
        }

        // Deleting meals in category.
        const meals = await Meal.find({ category: id })

        // Deleting images of meals from supabase storage.
        await Promise.all(meals.map(meal => deleteImage(meal.image_name)))

        // Deleting meals in category from database.
        await Meal.deleteMany({ category: id })

        // Deleting image of category.
        await deleteImage(category.image_name)

        // Deleting category from database.
        await Category.findByIdAndDelete(id)

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Category has been deleted successfully."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteAllCategories = async (req, res) => {
    try {
        // Checking categories for existence.
        const categories = await Category.find()

        for (const category of categories) {
            // Deleting meals in categories.
            const meals = await Meal.find({ category: category._id })

            // Deleting images of meals from supabase storage.
            await Promise.all(meals.map(meal => deleteImage(meal.image_name)))

            // Deleting all meals of category from database.
            await Meal.deleteMany({ category: category._id })
        }

        // Deleting images in categories from supabase storage.
        await Promise.all(categories.map(category => deleteImage(category.image_name)))

        // Deleting categories from database.
        await Category.deleteMany()

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Categories have been deleted successfully."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}
