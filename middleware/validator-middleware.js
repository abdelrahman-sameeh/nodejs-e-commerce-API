
const { validationResult } = require("express-validator")

// @decs  get errors during make validation 
const validatorMiddleware = (req, res, next) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }
   next()
}



module.exports = validatorMiddleware