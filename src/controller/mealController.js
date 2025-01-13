const { Category } = require("../model/categoryModel")
const { Meal } = require("../model/mealModel")
const { errorHandling } = require("./errorController")
const { idChecking } = require("./idController")
const { uploadImage, getImageUrl, deleteImage } = require("./imageConroller")
const { validationController } = require("./validationController")
const fs = require('fs')

exports.mealPage = (req, res) => {
    try {
        return res.render('meal', {
            layout: false,
            mealPage: true
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

        // Checking name a meal to exists. (If mael exists with current name return error.)
        const condidat = await Meal.findOne({
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
                error: { message: "Name a meal is already exists! Please enter another name." }
            })
        }

        // Checking category to valid and exists.
        const selectedCategory = await Category.findById(data.category)
        if (!selectedCategory) {
            fs.unlinkSync(filePath)
            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Selected category is not found!" }
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

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Meal has been created successful."
            }
        })
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

exports.updateOneMeal = async (req, res) => {
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

        const meal = await Meal.findById(id).populate('category')
        if (!meal) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }

            // Responding.
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Meal is not found!" }
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
            if (meal.en_name != data.en_name || meal.ru_name != data.ru_name || meal.en_description != data.en_description || meal.ru_description != data.ru_description || meal.price != data.price || meal.category != data.category) {
                const condidat = await Meal.findOne({
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
                            error: { message: `Already exists meal with name (en or ru).` }
                        })
                    }
                } else {
                    // Writing changes to database.
                    meal.en_name = data.en_name
                    meal.ru_name = data.ru_name
                    meal.en_description = data.en_description
                    meal.ru_description = data.ru_description
                    meal.price = data.price
                    meal.category = data.category
                    await Meal.findByIdAndUpdate(id, meal)
                }
            }
        } else {
            // Registration path and name of file.
            const filePath = req.file.path
            const fileName = req.file.filename

            // Checking name for exists. (If exists responsing error.)
            const condidat = await Meal.findOne({
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
                    error: { message: `Already exists meal with name (en or ru).` }
                })
            } else {
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
            }
        }

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Meal has been updated successful."
            }
        })
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
            // Responding.
            return res.status(400).send({
                success: false,
                data: null,
                error: idError
            })
        }

        // Checking meal to exists.
        const meal = await Meal.findById(id)
        if (!meal) {
            return res.status(404).send({
                success: false,
                data: null,
                error: { message: "Meal is not found!" }
            })
        }

        // Deleting image of category.
        deleteImage(meal.image_name)

        // Deleting meal from database.
        await Meal.findByIdAndDelete(id)

        // Responding.
        return res.status(201).send({
            success: true,
            error: false,
            data: {
                message: "Meal has been deleted successful."
            }
        })
    }

    // Error handling.
    catch (error) {
        errorHandling(error, res)
    }
}

exports.deleteManyMeals = async (req, res) => {
    try {
        // Deleting images of meals from supabase database.
        const meals = await Meal.find()
        for (const meal of meals) {
            await deleteImage(meal.image_name)
        }

        // Deleting all meals from database.
        await Meal.deleteMany()

        // Responding.
        return res.status(200).send({
            success: true,
            error: false,
            data: { message: "Meals have been deleted successfully." }
        })
    }

    // Error handling.
    catch (error) {

    }
}