const mongoose = require('mongoose')
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())

dotenv.config({path: './config.env'})
require('./database/connection');
app.use(express.json());

app.use(require('./routes/router'));

// const middleware = (req,res,next) => {
//     console.log('Middleware.');
//     next();
// }

const PORT = process.env.PORT;

// const User = require('./models/userModel');

app.listen(PORT,function(){
    console.log(`Server is Running on Port ${PORT}...`);
});