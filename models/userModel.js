const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    validate: [isEmail, 'Invalid email'],
    lowercase: true,
  },
  image: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    maxLength: 20,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = new mongoose.model('user', userSchema);

module.exports = User;
