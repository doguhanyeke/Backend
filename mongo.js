const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
let name = null
let number = null
if (process.argv.length === 5) {
    name = process.argv[3]
    number = process.argv[4]
}

const url =
`mongodb+srv://fullstack_dogu:${password}@cluster0.kcozd.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        console.log('object', result)
        mongoose.connection.close()
    })
}

else {
    Person.find({}).then(result => {
        result.forEach(element => {
            console.log(element)
        })
        mongoose.connection.close()
    })
}
