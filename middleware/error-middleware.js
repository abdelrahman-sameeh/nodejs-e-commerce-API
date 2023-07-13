exports.globalError = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500
   err.status = err.status || 'error'

   if(process.env.NODE_ENV === 'dev'){
      // in dev mode 
      sendErrorForDevelopment(err, res)
   }else if(process.env.NODE_ENV === 'prod'){
      // in production mode 
      sendErrorForProduction(err, res)
   }
}


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