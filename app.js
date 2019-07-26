require ("./config/mongoose");
require ("./config/sequelize");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users"); // importamos el router en la aplicación principal
var destinationsRouter = require("./routes/destinations")
var port = process.env.PORT || 3000; //TODO

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter); //aplicamos el router como middleware, es decir todas la rutas dirigidas a /users pasaran por el router creado
app.use('/destinations', destinationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
z
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen( port, () => console.log( `servidor levantado en ${port}` ) ) //TODO

module.exports = app;





