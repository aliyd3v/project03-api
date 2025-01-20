const { errorHandling } = require("./errorController")
const { Category } = require("../model/categoryModel")
const fs = require('fs')
const { idChecking } = require("./idController")
const { uploadImage, getImageUrl, deleteImage } = require("./imageConroller")
const { validationController } = require("./validationController")
const { Meal } = require("../model/mealModel")

exports.categoryPage = async (req, res) => {
    try {
        // Get all categories from database.
        const categories = await Category.find().populate('meals')

        // Rendering.
        return res.render('category', {
            layout: false,
            categories
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createCategoryPage = (req, res) => {
    try {
        // Rendering.
        return res.render('category-create', {
            layout: false
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
            // Rendering.
            return res.render('category-create', {
                layout: false,
                inputedData: data,
                errorMessage: error
            })
        }

        // Registration path and name of file.
        const filePath = req.file.path
        const fileName = req.file.filename

        // Checking name for existence. (If exists responsing error.)
        const en_name_condidat = await Category.findOne({ en_name: data.en_name })
        if (en_name_condidat) {
            fs.unlinkSync(filePath)
            // Rendering.
            return res.render('category-create', {
                layout: false,
                inputedData: data,
                errorMessage: `Already exists category with english name "${data.en_name}". Please enter another english name!`
            })
        }
        const ru_name_condidat = await Category.findOne({ ru_name: data.ru_name })
        if (ru_name_condidat) {
            fs.unlinkSync(filePath)
            // Rendering.
            return res.render('category-create', {
                layout: false,
                inputedData: data,
                errorMessage: `Already exists category with russian name "${data.ru_name}". Please enter another russian name!`
            })
        }

        // Uploading image to supabse storage and get image url.
        const { errorSupabase } = await uploadImage(fileName, filePath)
        if (errorSupabase) {
            fs.unlinkSync(filePath)
            // Responding.
            return res.render('category-create', {
                layout: false,
                inputed: data,
                errorMessage: 'Error uploading image! Please try again later.'
            })
        }
        const { publicUrl } = await getImageUrl(fileName, filePath)
        fs.unlinkSync(filePath)

        // Writing new category to database.
        await Category.create({
            en_name: data.en_name,
            ru_name: data.ru_name,
            image_url: publicUrl,
            image_name: fileName
        })

        // Redirect.
        return res.redirect('/category')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        // Getting all categories from database.
        const categories = await Category.find().populate('meals')

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
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Searching category with id.
        const category = await Category.findById(id).populate('meals')

        // Checking category for existence.
        if (!category) {
            // Rendering.
            return res.render('not-found', {
                layout: false
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

exports.updateCategoryPage = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Get old category from database.
        const oldCategory = await Category.findById(id)
        if (!oldCategory) {
            // Rendering.
            return res.render('not-found', {
                layout: false
            })
        }

        return res.render('category-update', {
            layout: false,
            oldCategory
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
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Checking category for existence.
        const category = await Category.findById(id)
        if (!category) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }

            // Rendering.
            return res.render('not-found', {
                layout: false
            })
        }

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('category-update', {
                layout: false,
                errorMessage: error
            })
        }

        if (!req.file) {
            if (category.en_name != data.en_name || category.ru_name != data.ru_name) {

                // Checking name for existence. (If exists responsing error.)
                const en_name_condidat = await Category.findOne({ en_name: data.en_name })
                if (en_name_condidat) {
                    // Rendering.
                    return res.render('category-update', {
                        layout: false,
                        inputedData: data,
                        errorMessage: `Already exists category with english name "${data.en_name}". Please enter another english name!`
                    })
                }
                const ru_name_condidat = await Category.findOne({ ru_name: data.ru_name })
                if (ru_name_condidat) {
                    // Rendering.
                    return res.render('category-update', {
                        layout: false,
                        inputedData: data,
                        errorMessage: `Already exists category with russian name "${data.ru_name}". Please enter another russian name!`
                    })
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


            // Checking name for existence. (If exists responsing error.)
            const en_name_condidat = await Category.findOne({ en_name: data.en_name })
            if (en_name_condidat) {
                fs.unlinkSync(filePath)
                // Rendering.
                return res.render('category-update', {
                    layout: false,
                    inputedData: data,
                    errorMessage: `Already exists category with english name "${data.en_name}". Please enter another english name!`
                })
            }
            const ru_name_condidat = await Category.findOne({ ru_name: data.ru_name })
            if (ru_name_condidat) {
                fs.unlinkSync(filePath)
                // Rendering.
                return res.render('category-update', {
                    layout: false,
                    inputedData: data,
                    errorMessage: `Already exists category with russian name "${data.ru_name}". Please enter another russian name!`
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
            await Category.findByIdAndUpdate(id, category)
        }

        // Redirect.
        return res.redirect('/category')
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
            // Rendering.
            return res.render('bad-request', { layout: false })
        }

        // Checking category for existence.
        const category = await Category.findById(id)
        if (!category) {
            // Rendering.
            return res.render('not-found', { layout: false })
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

        // Redirect.
        return res.redirect('/category')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}