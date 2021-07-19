const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moment = require('moment');
const cors = require('cors');
let today = moment().format();
const app = express();
const session = require("express-session");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: true,
    saveUninitialized: true,
  })
)

// let loginAndRegister = require('./api/LoginAndRegister/loginandregister.js')
let official = require("./api/Official/official.js");
let series = require("./api/Official/series.js");

app.use("/official", official);
app.use("/series", series);
// app.use("/loginAndRegister", loginAndRegister);
// let checkout = require("./api/Checkout/checkout.js");
// app.use("/checkout", checkout);



app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use(function (req, res, next) {
  console.log(`有人在${today}來訪問`);
  next();
});



app.get("/", function (req, res) {
  // res.send("Hello Express BBB");
  res.cookie("lang", "zh-TW");
  res.render("index");
  // views/index.pug
});


app.use(function (req, res, next) {
  console.log(`有人在${today}來訪問`);
  next();
});

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
