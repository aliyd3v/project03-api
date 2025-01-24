const express = require('express')
const app = express()
const router = require('./src/route/route')
const { create } = require('express-handlebars')
const handlebars = require('handlebars')
const { port, cookieParserKey } = require('./src/config/config')
const cors = require('cors')
const { connectMongodb } = require('./src/database/database')
const cookieParser = require('cookie-parser')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

// Setup MongoDB.
connectMongodb()

// Setup static folder.
app.use(express.static('./public'))

// Handlebars setup
const hbs = create({
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars),
    helpers: {
        isEqual: (a, b) => a === b
    }
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

// Body and cookie parsing tools setup.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(cookieParserKey))

// Setup security tools.
app.use(cors())

// Router setup.
router.appRouter(app)

// Listening port setup.
app.listen(port, () => console.log(`Server runned on port ${port}`))