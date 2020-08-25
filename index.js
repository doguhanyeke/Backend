const express = require('express')
const app = express()

app.use(express.json())

 let persons = [
     {
         "name": "Dogu",
         "number": "1234",
         "id": 1
     },
     {
         "name": "Batu",
         "number": "1234",
         "id": 2
     }
 ]

app.get("/api/persons", (req,res) => {
    res.json(persons)
})

app.get("/api/info", (req,res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`)
})

app.get("/api/persons/:id", (req,res) => {
    console.log(req.params.id)
    const personId = Number(req.params.id)
    const person = persons.find(person => person.id === personId)
    if(person) {
        res.json(person)
    } else{
        res.status(404).end()
    }  
})

app.delete("/api/persons/:id", (req, res) => {
    const personId = Number(req.params.id)
    console.log("here", personId)
    persons = persons.filter(person => person.id !== personId)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const personBody = req.body
    const personCand = persons.find(person => person.name === personBody.name)
    if(personBody.name === ""){
        res.status(404).json({
            "error": "name must be filled"
        })
    }
    else if(personBody.number === ""){
        res.status(404).json({
            "error": "number must be filled"
        })
    }
    else if(personCand){
        res.status(404).json({
            "error": "name must be unique"
        })
    }
    else{
        const personId = Math.floor(Math.random() * 1000)
        personBody.id = personId

        persons = persons.concat(personBody)
        res.end()
    }
    
})

const PORT = 3001
app.listen(PORT, () => {
    console.log("Server running")
})