const morgan = require('morgan')
const logger = require('../utils/logger')

const requestLogger = function(req, res, next){
    logger.info('##########')
    logger.info('Method: ', req.method)
    logger.info('Path: ', req.path)
    logger.info('Body: ', req.body)
    logger.info('##########')
    next()
}

morgan.token(
    'postType',
    function(req, res) {
        if(req.method === 'POST'){
            return JSON.stringify(req.body)
        }
    }
)
const morganConfig = morgan(function (tokens, req, res) {
    return [
        'MESSAGE:',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res), 'ms',
        tokens.postType(req, res)
    ].join(' ')
})

const unknownendpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

module.exports = {
    requestLogger,
    morganConfig,
    unknownendpoint,
    errorHandler
}