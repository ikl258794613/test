// const createError = require('http-errors');
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
const passport = require('passport')
// const bodyParser = require('body-parser');
require('./database/passport.js')(passport)
app.use(passport.initialize())
app.use(passport.session())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,x-token',
  })
)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser);
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
// home 
const homeRouter = require('./api/Home/home');

//member
const member = require('./api/Member/member.js')
const loginAndRegister = require('./api/LoginAndRegister/loginandregister.js')
const memberOrder = require('./api/Member/memberOrder.js')
//sidebar
const sidebar = require('./api/Sidebar/sidebar.js')
//購物車
const checkout = require("./api/Checkout/checkout.js");
const officialorder = require("./api/Checkout/officialorder.js")
const customorder = require("./api/Checkout/customorder.js")
const courseorder = require("./api/Checkout/courseorder.js")
//客製化服務
const customRouter = require('./api/Custom/custom')
//官方商品
const official = require("./api/Official/official.js");
const series = require("./api/Official/series.js");
const search = require("./api/Official/search.js");
const buyProduct = require("./api/Official/buyProduct.js")
const collectProduct = require("./api/Official/collectProduct.js")
const officialId = require("./api/Official/officialid.js");
//課程
const course = require('./api/Course/course.js');
const getCourseForm = require("./api/Course/getForm.js");
const getCollect = require("./api/Course/getCollect.js")


//排行榜
const bestSellerRouter = require('./api/Bestseller/bestseller')

//home
app.use('/home', homeRouter);
//member
app.use("/member", member)
app.use("/loginAndRegister", loginAndRegister)
app.use("/memberOrder", memberOrder)
//sidebar
app.use('/sidebar', sidebar)
//購物車
app.use("/checkout", checkout)
app.use("/officialorder",officialorder)
app.use("/customorder",customorder)
app.use("/courseorder",courseorder)
//客製化服務
app.use('/custom', customRouter)
//官方商品
app.use("/official", official)
app.use("/series", series)
app.use("/search", search)
app.use("/buyProduct", buyProduct)
app.use("/collectProduct", collectProduct)
app.use("/officialid", officialId);
//課程
app.use("/course", course)
app.use("/getCourseForm", getCourseForm)
app.use("/getCollect", getCollect);
//排行榜
app.use('/bestseller', bestSellerRouter)

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
  // next(createError(404));
  res.status(err.status || 500);
  res.render('error');
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
