const ApiError = require("../utils/ApiError")

exports.globalError = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500
   err.status = err.status || 'error'

   if (process.env.NODE_ENV === 'dev') {
      // in dev mode 
      sendErrorForDevelopment(err, res)
   } else if (process.env.NODE_ENV === 'prod') {

      // expired token
      if (err.name === 'TokenExpiredError') err = handleJwtExpired()

      // invalid signature for change token
      if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature()
      // in production mode 
      sendErrorForProduction(err, res)
   }
}

const handleJwtInvalidSignature = () => new ApiError('Invalid token, please login again...', 401)
const handleJwtExpired = () => new ApiError('Expired token, please login again...', 401)

const sendErrorForDevelopment = (err, res) => {
   return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
   })
}


const sendErrorForProduction = (err, res) => {

   return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   })
}