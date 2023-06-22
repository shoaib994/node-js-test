
const express=require('express');
const app=express()
require('dotenv').config()
const cors = require("cors");
const PORT=process.env.PORT ||4000
const path = require("path");

app.listen(PORT,()=>console.log(`server is working on ${PORT}`))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const corsOptions = {
    origin: '*',
    'Access-Control-Allow-Origin': '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use('/api/v1/sheet', require('./routes/user'))
 
module.exports=app