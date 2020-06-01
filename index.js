const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors());

const PORT = process.env.PORT || 3000;


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


const UserRoute = require('./routes/userRoute');
const DepartmentRoute = require('./routes/departmentRoute');
const FormRoute = require('./routes/formRoute');


app.use('/user', UserRoute);
app.use('/department', DepartmentRoute);
app.use('/form', FormRoute);



const URL = `mongodb://127.0.0.1:27017/switchon`
mongoose.connect(URL, {useNewUrlParser : true},(err) => {
    if (err) {
    	console.log(err)
        console.log('Error while Connecting!')
    } else {
        console.log('Connected to Mongo DB')
    }
})


app.listen(PORT, () => {
    console.log('Server Started on PORT ' + PORT)
})