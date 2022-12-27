
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name : {
    type: String,
    required: [true, 'please provide name.']
  },
  email: {
    type: String,
    required: [true, 'Please provide email.'],
    validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email'
    },
   unique: true 
  },
  password: {
    type: String,
    required: [true, 'please provide password.'],
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre("save", async function () {
  if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});


UserSchema.methods.createToken = function () {
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

UserSchema.methods.comparePassword = async function(userPassword){
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
 }

module.exports = mongoose.model('User', UserSchema);