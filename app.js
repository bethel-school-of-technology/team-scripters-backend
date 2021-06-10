var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts')

//APP RUNNING ON PORT 5000

var app = express();

//MONGO CONNECTION

var connectionString = "";
//const {MongoClient} = require('mongodb');
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true }, function() { 
    console.log("database is connected");
});

app.use(cors({
    origin:"http://localhost:4200"
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

module.exports = app;
