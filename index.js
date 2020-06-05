const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const WebSocket = require('ws')
const { dbdetails } = require('./config/config')
app.use(cors())

const PORT = process.env.PORT || 4000

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

const UserRoute = require('./routes/userRoute')
const DepartmentRoute = require('./routes/departmentRoute')
const FormRoute = require('./routes/formRoute')
const NotificationRoute = require('./routes/notificationRoute')

app.use('/user', UserRoute)
app.use('/department', DepartmentRoute)
app.use('/form', FormRoute)
app.use('/notification', NotificationRoute)

// const URL = 'mongodb://127.0.0.1:27017/switchon'

const URL = 'mongodb://' + dbdetails.username + ':' + dbdetails.password + '@' + dbdetails.host + ':' + dbdetails.port + '/' + dbdetails.database
mongoose.connect(URL, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('Error while Connecting!')
  } else {
    console.log('Connected to Mongo DB')
  }
})

// app.listen(PORT, () => {
//     console.log('Server Started on PORT ' + PORT)
// })

var server = app.listen(PORT, function () {
  console.log('app started')
})

app.get('/', function (req, res) {
  res.send('Welcome!')
})

const wss = new WebSocket.Server({ server: server })

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (data) {
    wss.clients.forEach(function each (client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log('Message Trannsferred')
        client.send(data)
      }
    })
  })
})
