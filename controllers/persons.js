const personRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')

personRouter.use(function ( req, res, next ) {
    logger.info("Route'un içindeyim!!!")
    next()
})

personRouter.get('/api/persons', (req,res) => {
    console.log('heree')
    Person.find({}).then(people => {
        res.json(people)
    })
})

personRouter.get('/api/info', (req,res,next) => {
    Person.find({}).then(person => {
        res.send(`<p>Phonebook has info for ${person.length} people</p>
            <p>${Date()}</p>`)
    }).catch( error => next(error))
})

personRouter.get('/api/persons/:id', (req,res,next) => {
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

personRouter.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then( person => {
        res.status(204).end()
    }).catch( error => next(error))
})

personRouter.post('/api/persons', (req, res, next) => {
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

personRouter.put('/api/persons/:id', (req, res, next) => {
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

module.exports = personRouter
