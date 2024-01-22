const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const config = require('./config.js')

const app = express()
const port = 8084

app.use(cors())

const conn = mysql.createConnection(config.db)

conn.connect(error => {
    if (error) {
        console.error('Error connecting to db:', error)
    } else {
        console.log('Connection to db successful')
    }
})

app.get('/', (req, res) => {
    conn.query('SELECT * FROM customer', (error, results) => {
        if (error) {
            console.error('Error on the query:', error)
            res.status(500).send('Server error')
        } else {
            res.json(results)
        }
    })
    // res.send('Esto es un mensaje desde el backend')
})

app.listen(port, () => {
    console.log(`Listening from port ${port}`)
})
