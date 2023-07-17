const { default: mongoose } = require("mongoose");
var bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
   username: {
      type: String,
      trim: true,
      required: [true, 'username is required']
   },
   slug: {
      type: String,
      lowercase: true,
   },
   email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'email is required'],
      unique: [true, 'email must be unique']
   },
   phone: String,
   profileImage: String,
   password: {
      type: String,
      required: [true, 'password is required'],
      minLength: [6, 'Too short password']
   },
   changedPasswordAt: Date,
   passwordResetCode: String,
   passwordResetCodeExpired: Date,
   passwordResetVerified: Boolean,
   role: {
      type: String,
      enum: ['admin', 'user', 'manager'],
      default: 'user'
   },
}, { timestamps: true })


// encrypt password
userSchema.pre('save', async function (next) {
   this.password = await bcrypt.hash(this.password, 12)
   next()
})


const User = mongoose.model('User', userSchema)


module.exports = User;