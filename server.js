const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8005
require('dotenv').config()


let db, 
    dbConnectionStr = process.env.DB_STRING
    dbName = 'star-trek-api'

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to Database`)
        db = client.db(dbName)

    })

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
