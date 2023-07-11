const { default: mongoose } = require("mongoose");

const dbConnection = () => {
   // Connect with db
   mongoose
      .connect(process.env.DB_URI)
      .then(conn => {
         console.log('connect with database ' + conn.connection.host);
      }).catch(err => {
         console.error('error ' + err);
         process.exit(1)
      })

}


module.exports = {
   dbConnection
}