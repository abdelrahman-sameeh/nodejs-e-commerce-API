const JWT = require('jsonwebtoken');

const generateToken = (payload) => {
   return JWT.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_DATE,
   })
}


module.exports = generateToken