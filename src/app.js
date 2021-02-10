const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const adminRoutes = require('./api/routes/admin');
const studentRoutes = require('./api/routes/students');
mongoose.connect('mongodb://localhost:27017/Admin-Api', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true } );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful!");
});

 


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method ==='OPTIONS'){
    res.header("Access-Control-Allow-Methods", 'PUT, POST, GET, PATCH, DELETE')
    return res.status(200).json({});
}
next();
});

app.use('/', adminRoutes);
app.use('/', studentRoutes);
app.use((req, res, next)=>{
    const error = new Error('Not found anything');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    })
})

module.exports = app;
