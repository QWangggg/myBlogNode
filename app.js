// var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var settings = require('./settings.js')

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/public', express.static('public')); //将文件设置成静态

app.use(session({
    //secret，配置加密字符串，它会在原有的基础上再和secret的值去拼接加密
    //目的是加强安全性，防止客户端恶意伪造
    secret: settings.cookieSecret,
    key: settings.db, // myBlog
    cookie: { maxAge: 10000 }, //30 days
    resave: true,
    //无论是否使用session,默认只要对页面发起请求，都会给客户端一个cookie
    saveUninitialized: true
}))

app.use(function(req, res, next) {
    if (!req.cookies.username) {
        if (req.url.indexOf('auth') > -1) {
            next()
        } else {
            res.status(501).send({
                code: '501',
                error: '请先登录'
            })
        }
    } else {
        next()
    }
})

indexRouter(app)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;