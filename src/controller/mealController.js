const { Category } = require("../model/categoryModel")
const { Meal } = require("../model/mealModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { uploadImage, getImageUrl, deleteImage } = require("./imageConroller")
const { validationController } = require("./validationController")
const fs = require('fs')

exports.mealPage = async (req, res) => {
    try {
        // Get all meals from database.
        const meals = await Meal.find().populate('category')

        // Rendering.
        return res.render('meal', {
            layout: false,
            meals
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createMealPage = async (req, res) => {
    try {
        // Get all categories from database.
        const categories = await Category.find()

        // Checking categories for existence.
        if (!categories) {
            // Rendering.
            return res.render('meal-create', {
                layout: false,
                errorMessage: "Categories are empty. Please, first create category!"
            })
        }

        // Rendering.
        return res.render('meal-create', {
            layout: false,
            categories
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.createMeal = async (req, res) => {
    try {
        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('meal-create', {
                layout: false,
                inputedData: data,
                errorMessage: error
            })
        }

        // Registration path and name of file.
        const filePath = req.file.path
        const fileName = req.file.filename

        // Find selected and all category from database.
        const selectedCategory = await Category.findById(data.category)
        const categories = await Category.find()

        // Checking name a meal to exists. (If mael exists with current name return error.)
        const en_name_condidat = await Meal.findOne({ en_name: data.en_name })
        if (selectedCategory) {

            const categoryIndex = categories.findIndex((value, index, array) => {
                return value.en_name == selectedCategory.en_name
            })
            categories.splice(categoryIndex, 1)

            if (en_name_condidat) {
                fs.unlinkSync(filePath)
                // Rendering.
                return res.render('meal-create', {
                    layout: false,
                    inputedData: data,
                    categories,
                    selectedCategory,
                    errorMessage: `Already exists with english name "${data.en_name}"! Please enter another name.`
                })
            }
            const ru_name_condidat = await Meal.findOne({ ru_name: data.ru_name })
            if (ru_name_condidat) {
                fs.unlinkSync(filePath)
                // Rendering.
                return res.render('meal-create', {
                    layout: false,
                    inputedData: data,
                    categories,
                    selectedCategory,
                    errorMessage: `Already exists with russian name "${data.ru_name}"! Please enter another name.`
                })
            }
        } else {
            fs.unlinkSync(filePath)
            // Rendering.
            return res.render('meal-create', {
                layout: false,
                inputedData: data,
                errorMessage: `Category is not valid. Please, select try again!`
            })
        }

        // Uploading image to supabse storage and get image url.
        await uploadImage(fileName, filePath)
        const { publicUrl } = await getImageUrl(fileName, filePath)
        fs.unlinkSync(filePath)

        // Writing new meal to database.
        const newMeal = await Meal.create({
            en_name: data.en_name,
            ru_name: data.ru_name,
            en_description: data.en_description,
            ru_description: data.ru_description,
            price: data.price,
            category: data.category,
            image_url: publicUrl,
            image_name: fileName
        })

        // Write new meal to selected category on database.
        selectedCategory.meals.push(newMeal)
        await Category.findByIdAndUpdate(selectedCategory._id, selectedCategory)

        // Redirect.
        return res.redirect('/meal')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find().populate('category')
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Getting all meals is successful.",
                meals
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.getOneMeal = async (req, res) => {
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

        // Checking meal to exists.
        const meal = await Meal.findById(id).populate('category')
        if (!meal) {
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Meal is not found!" }
            })
        }

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: {
                message: "Meal has been getted successful.",
                meal
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateMealPage = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('not-found', {
                layout: false
            })
        }

        // Checking meal for existence.
        const meal = await Meal.findById(id).populate('category')
        if (!meal) {
            // Rendering.
            return res.render('not-found', {
                layout: false
            })
        }

        // Get all categories from database.
        const categories = await Category.find()
        const categoryIndex = categories.findIndex((value, index, array) => {
            return value.en_name == meal.category.en_name
        })
        categories.splice(categoryIndex, 1)

        // Rendering.
        return res.render('meal-update', {
            layout: false,
            oldMeal: meal,
            categories
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.updateOneMeal = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking meal for existence.
        const meal = await Meal.findById(id).populate('category')
        if (!meal) {
            if (req.file) fs.unlinkSync(req.file.path)
            // Rendering.
            return res.render('not-found', { layout: false })
        }
        const oldCategory = meal.category

        // Get all categories from database.
        const categories = await Category.find()

        // Result validation.
        const { data, error } = validationController(req, res)
        if (error) {
            // Rendering.
            return res.render('meal-update', {
                layout: false,
                oldMeal: meal,
                inputedData: data,
                errorMessage: error,
                categories
            })
        }

        if (!req.file) {
            if (meal.en_name != data.en_name || meal.ru_name != data.ru_name || meal.en_description != data.en_description || meal.ru_description != data.ru_description || meal.price != data.price || meal.category != data.category) {
                const en_name_condidat = await Meal.findOne({ en_name: data.en_name })
                if (en_name_condidat) {
                    if (en_name_condidat._id != id) {
                        // Rendering.
                        return res.render('meal-update', {
                            layout: false,
                            oldMeal: meal,
                            inputedData: data,
                            errorMessage: `Already exists with english title meal "${data.en_name}".`,
                            categories
                        })
                    }
                }
                const ru_name_condidat = await Meal.findOne({ ru_name: data.ru_name })
                if (ru_name_condidat) {
                    if (en_name_condidat._id != id) {
                        // Rendering.
                        return res.render('meal-update', {
                            layout: false,
                            oldMeal: meal,
                            inputedData: data,
                            errorMessage: `Already exists with russian title meal "${data.ru_name}".`,
                            categories
                        })
                    }
                }

                // Writing changes to database.
                meal.en_name = data.en_name
                meal.ru_name = data.ru_name
                meal.en_description = data.en_description
                meal.ru_description = data.ru_description
                meal.price = data.price
                meal.category = data.category
                await Meal.findByIdAndUpdate(id, meal)

                // Checking changing and update categories.
                if (meal.category != oldCategory) {
                    // Delete meal from old selected category.
                    const oldCategoryData = await Category.findById(oldCategory).populate('meals')
                    const indexMeal = oldCategoryData.meals.findIndex((value, index, array) => {
                        return value._id == id
                    })
                    oldCategoryData.meals.splice(indexMeal, 1)
                    await Category.findByIdAndUpdate(oldCategory, oldCategoryData)

                    // Add meal to new selected category.
                    const newSelectedCategory = await Category.findById(meal.category).populate('meals')
                    newSelectedCategory.meals.push(meal)
                    await Category.findByIdAndUpdate(meal.category, newSelectedCategory)
                }
            }
        } else {
            // Registration path and name of file.
            const filePath = req.file.path
            const fileName = req.file.filename

            // Checking name for exists. (If exists responsing error.)
            const en_name_condidat = await Meal.findOne({ en_name: data.en_name })
            if (en_name_condidat) {
                if (en_name_condidat._id != id) {
                    fs.unlinkSync(filePath)
                    // Rendering.
                    return res.render('meal-update', {
                        layout: false,
                        oldMeal: meal,
                        inputedData: data,
                        errorMessage: `Already exists with english title meal "${data.en_name}".`,
                        categories
                    })
                }
            }
            const ru_name_condidat = await Meal.findOne({ ru_name: data.ru_name })
            if (ru_name_condidat) {
                if (en_name_condidat._id != id) {
                    fs.unlinkSync(filePath)
                    // Rendering.
                    return res.render('meal-update', {
                        layout: false,
                        oldMeal: meal,
                        inputedData: data,
                        errorMessage: `Already exists with russian title meal "${data.ru_name}".`,
                        categories
                    })
                }
            }

            // Delete old image of category.
            deleteImage(meal.image_name)

            // Uploading image to supabse storage and get image url.
            await uploadImage(fileName, filePath)
            const { publicUrl } = await getImageUrl(fileName, filePath)
            fs.unlinkSync(filePath)

            // Writing changes to database.
            meal.en_name = data.en_name
            meal.ru_name = data.ru_name
            meal.en_description = data.en_description
            meal.ru_description = data.ru_description
            meal.price = data.price
            meal.category = data.category
            meal.image_url = publicUrl
            meal.image_name = fileName
            await Meal.findByIdAndUpdate(id, meal)

            // Checking changing and update categories.
            if (meal.category != oldCategory) {
                // Delete meal from old selected category.
                const oldCategoryData = await Category.findById(oldCategory).populate('meals')
                const indexMeal = oldCategoryData.meals.findIndex((value, index, array) => {
                    return value._id == id
                })
                oldCategoryData.meals.splice(indexMeal, 1)
                await Category.findByIdAndUpdate(oldCategory, oldCategoryData)

                // Add meal to new selected category.
                const newSelectedCategory = await Category.findById(meal.category).populate('meals')
                newSelectedCategory.meals.push(meal)
                await Category.findByIdAndUpdate(meal.category, newSelectedCategory)
            }
        }

        // Redirect.
        return res.redirect('/meal')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteOneMeal = async (req, res) => {
    const { params: { id } } = req
    try {
        // Checking id to valid.
        const idError = idChecking(req, id)
        if (idError) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Checking meal to exists.
        const meal = await Meal.findById(id)
        if (!meal) {
            // Rendering.
            return res.render('not-found', { layout: false })
        }

        // Deleting image of category.
        deleteImage(meal.image_name)

        // Deleting meal from database.
        await Meal.findByIdAndDelete(id)

        // Redirect.
        return res.redirect('/meal')
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}