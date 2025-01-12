const express = require('express')
const app = express()
const router = require('./src/route/route')
const { create } = require('express-handlebars')
const handlebars = require('handlebars')
const cookieParser = require('cookie-parser')
const { port } = require('./src/config/config')
const cors = require('cors')
const { connectMongodb } = require('./src/database/database')
const { default: helmet } = require('helmet')

// Setup MongoDB.
connectMongodb()

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

// Setup security tools.
// app.use(cors())
// app.use(helmet())

// Router setup.
router.appRouter(app)

// Listening port setup.
app.listen(port, () => console.log(`Server runned on port ${port}`))