var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//APP RUNNING ON PORT 5000

var app = express();

//MONGO CONNECTION
//ask bob about this section
var connectionString = "mongodb+srv://warroom.byzmr.mongodb.net/myFirstDatabase" 
const {MongoClient} = require('mongodb');
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true }, function() { 
    console.log("database is connected");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('api/users', usersRouter);

module.exports = app;
