const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  departmentId: String
})

module.exports = mongoose.model('User', UserSchema)
