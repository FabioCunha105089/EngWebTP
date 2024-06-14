var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var mongoDB = 'mongodb://mongodb:27017/engWebTP2024'
mongoose.connect(mongoDB)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'))
db.once('open', () => {
  console.log("Conexão ao MongoDB realizada com sucesso")
})

var ruaRouter = require('./routes/rua.js');
var infoRuaRouter = require('./routes/inforua.js');
var entidadeRouter = require('./routes/entidade.js');
var lugarRouter = require('./routes/lugar.js');
var userRouter = require('./routes/user.js');
var gestaoRouter = require('./routes/gestao.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session setup
app.use(session({
  secret: 'EngWebTP2024',
  resave: false,
  saveUninitialized: true,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
var userModel = require('./models/user');
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use('/rua', ruaRouter);
app.use('/inforua', infoRuaRouter);
app.use('/entidade', entidadeRouter);
app.use('/lugar', lugarRouter);
app.use('/user', userRouter);
app.use('/gestao', gestaoRouter);

module.exports = app;