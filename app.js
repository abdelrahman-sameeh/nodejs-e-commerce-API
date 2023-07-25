const path = require('path')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')

require('dotenv').config({ path: '.env' })

const { dbConnection } = require('./config/database')
const ApiError = require('./utils/ApiError')
const { globalError } = require('./middleware/error-middleware')
const { mountRoutes } = require('./routes/index')
const { webhookCheckout } = require('./services/order-service')



const app = express()
// allow any client access end points
app.use(cors())
app.options('*', cors())

// use it to compressed the response
app.use(compression())

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



app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout)


// Mount Routes
mountRoutes(app)




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


