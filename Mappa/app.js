var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var ruasRouter = require('./routes/ruas')
var entidadesRouter = require('./routes/entidades')
var lugaresRouter = require('./routes/lugares')
var contaRouter = require('./routes/conta')
var gestaoRouter = require('./routes/gestao')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pfpics', express.static(path.join(__dirname, 'pfpics')));

// Session setup
app.use(session({
  secret: 'EngWebTP2024',
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.token;
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use('/', indexRouter);
app.use('/ruas', ruasRouter)
app.use('/entidades', entidadesRouter)
app.use('/lugares', lugaresRouter)
app.use('/conta', contaRouter)
app.use('/gestao', gestaoRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
