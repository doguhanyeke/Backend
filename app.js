const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const personRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const app = express()

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB', error.message
        )
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.morganConfig)
app.use('/', personRouter)
app.use(middleware.unknownendpoint)
app.use(middleware.errorHandler)

module.exports = app