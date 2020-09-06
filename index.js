require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('build'))

app.use(cors())

app.use(express.json())

const Person = require('./models/person')

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
app.use(morganConfig)

app.get('/api/persons', (req,res) => {
    console.log('heree')
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/info', (req,res,next) => {
    Person.find({}).then(person => {
        res.send(`<p>Phonebook has info for ${person.length} people</p>
            <p>${Date()}</p>`)
    }).catch( error => next(error))
})

app.get('/api/persons/:id', (req,res,next) => {
    Person.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then( person => {
        res.status(204).end()
    }).catch( error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const personBody = JSON.parse(JSON.stringify(req.body))
    console.log(personBody)

    const person = new Person({
        name: personBody.name,
        number: personBody.number
    })
    person.save().then( savedPerson => {
        res.send(savedPerson)
    }).catch(error => {
        next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const editedPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, editedPerson, { new: true, runValidators: true, context: 'query' }).then(result => {
        res.json(result)
    }).catch( error =>
        next(error)
    )
})

const unknownendpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownendpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server running')
})