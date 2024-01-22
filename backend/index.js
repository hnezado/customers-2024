const express = require('express')
const cors = require('cors')

const app = express()
const port = 8084

app.use(cors())

app.get('/', (req, res) => {
    res.send('Esto es un mensaje desde el backend')
})

app.listen(port, () => {
    console.log(`Listening from port ${port}`)
})
