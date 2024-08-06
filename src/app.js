const express =require('express')
const mongoose = require('mongoose')
const { config } = require ('dotenv')
const bodyParse = require('body-parser')
config()



// puerto
const port = process.env.PORT || 3000
// fin puerto

// rutas
const bookRoutes = require('./routes/book.routes')
const bodyParser = require('body-parser')
// fin rutas

// usamos express para los middleware
const app = express();
// fin express

// middleware parseador de body
app.use(bodyParser.json())
// fin middleware parseador de body

// aca conectaremos la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;
// fin aca conectaremos la base de datos

// usando las rutas
app.use('/books', bookRoutes)
// fin usando las rutas


// escuchar el servidor en el puerto ...
app.listen (port, ()=> {
    console.log(`servidor iniciando en el puerto: ${port}`)
})