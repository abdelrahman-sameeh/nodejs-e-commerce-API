const path = require('path')

const express = require('express')
const app = express()
const morgan = require('morgan')

require('dotenv').config({ path: '.env' })
const categoryRoute = require('./routes/category-route')
const subCategoryRoute = require('./routes/sub-category-route')
const brandsRoute = require('./routes/brands-route')
const productRoute = require('./routes/product-route')
const userRoute = require('./routes/user-route')
const authRoute = require('./routes/auth-route')

const { dbConnection } = require('./config/database')
const ApiError = require('./utils/ApiError')
const { globalError } = require('./middleware/error-middleware')


// connect with database
dbConnection()


// Middleware

app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))


if (process.env.NODE_ENV === 'dev') {
   app.use(morgan('dev'))
}

if (process.env.NODE_ENV) {
   console.log(`node ${process.env.NODE_ENV}`);
}




// Mount Routes
app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/subcategories', subCategoryRoute)
app.use('/api/v1/brands', brandsRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/auth', authRoute)




// handle all route 
app.all('*', (req, res, next) => {
   // const error = new Error(`can't find route match this url ${req.originalUrl}`)
   next(new ApiError(`can't find route match this url ${req.originalUrl}`, 400))
})

// global error handle middleware
app.use(globalError)



const port = process.env.PORT || 8000

// run server
const server = app.listen(port, () => {
   console.log(`server listen in http://localhost:${port}`);
})



// handle rejection outside express
process.on('unhandledRejection', (err) => {
   console.error(`rejection unhandle error ${err.name} -> ${err.message}`);
   // if have a pending request => server close after end it
   server.close(() => {
      console.log('shutting down application ...');
      // close app
      process.exit(1)
   })
}) 