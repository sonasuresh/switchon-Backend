const mongoose = require('mongoose')
const FormSchema = mongoose.Schema({
  createdById: String,
  assignedToId: String,
  message: String,
  status: {
    type: String,
    default: 'Pending'
  }
})

module.exports = mongoose.model('Form', FormSchema)
