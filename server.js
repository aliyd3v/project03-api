const express = require('express')
const app = express()
const router = require('./src/route/route')

app.use(express.json())
app.use('/', router)

app.listen(3000, () => console.log(`Server runned on port 3000`))