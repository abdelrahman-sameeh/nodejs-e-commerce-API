require('dotenv').config({ path: '.env' })
const morgan = require('morgan')
const express = require('express')
const app = express()

const categoryRoute = require('./routes/category-route')

const {dbConnection} = require('./config/database')

// connect with database
dbConnection()


// Middleware

app.use(express.json())


if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
   console.log('node ' + process.env.NODE_ENV);
}




// Routes
app.use('/api/v1/categories', categoryRoute)



// run server
const port = process.env.PORT || 8000
app.listen(port, () => {
   console.log(`server is listen in http://localhost:${port}`);
})