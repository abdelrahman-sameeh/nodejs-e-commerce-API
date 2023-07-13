const { default: mongoose } = require("mongoose");

const dbConnection = () => {
   // Connect with db
   mongoose
      .connect(process.env.DB_URI)
      .then(conn => {
         console.log('connect with database ' + conn.connection.host);
      })

}


module.exports = {
   dbConnection
}