const { response } = require('express')
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8005
require('dotenv').config()


let db, 
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'star-trek-api'

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//CRUD Methods
app.get('/', (request,response) => {
    let contents = db.collection('alien-info').find().toArray()
    .then(data => {
        let namelist = data.map(item => item.speciesName)
        console.log(namelist)
        response.render('index.ejs', {info: namelist})
    })
    .catch(error => console.log(error))
})

app.post('/api', (request,response) => {

    console.log("post heard")
    db.collection('alien-info').insertOne(
        request.body
    )
    .then(result => {
        console.log(result)
        response.redirect('/')
    })


})

app.put('/updateEntry', (request,response) => {
    console.log(request.body)
    Object.keys(request.body).forEach(key => {
        if(request.body[key] === null || request.body[key] === undefined || request.body[key] === "") {
            delete request.body[key]
        }        
    });
    console.log(request.body)
    db.collection('alien-info').findOneAndUpdate(
        {name: request.body.name},
        {
            $set: request.body
        }

    )
    .then(result => {
        console.log(result)
        console.log('Success')

    })
    .catch(error => console.error(error))
})

app.delete('/deleteEntry', (request,response) => {
    db.collection('alien-info').deleteOne(
        {name: request.body.name}
    )
    .then(result => {
        console.log('Entry Deleted')
        response.json('Entry Deleted')
    })
    .catch(error => console.error(error))

})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
