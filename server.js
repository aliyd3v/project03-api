const express = require('express')
const app = express()
const router = require('./src/route/route')
const { create } = require('express-handlebars')
const handlebars = require('handlebars')

// Setup static folder.
app.use(express.static('./public'))

// Handlebars setup
const hbs = create({
    extname: 'hbs',
    handlebars: handlebars
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

// Body parsing tools.
app.use(express.json())

// Router setup.
router.appRouter(app)

// Listening port setup.
app.listen(3000, () => console.log(`Server runned on port 3000`))