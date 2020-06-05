const mongoose = require('mongoose')
const Form = require('./formModel')

const NotificationSchema = mongoose.Schema({
  requestedId: String,
  assignedId: String,
  message: String,
  form: Array
})

module.exports = mongoose.model('Notification', NotificationSchema)
