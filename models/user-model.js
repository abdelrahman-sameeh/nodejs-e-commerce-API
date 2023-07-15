const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
   username: {
      type: String,
      trim: true,
      required: [true, 'username is required']
   },
   slug: {
      type:String,
      lowercase: true,
   },
   email:{
      type:String,
      trim: true,
      lowercase: true,
      required: [true, 'email is required'],
      unique: [true, 'email must be unique']
   },
   phone: String,
   profileImage: String,
   password:{
      type:String,
      required: [true, 'password is required'],
      minLength: [6, 'Too short password']
   },
   role: {
      type:String,
      enum: ['admin', 'user'],
      default: 'user'
   },

}, {timestamps: true})


const User = mongoose.model('User',userSchema)


module.exports = User;