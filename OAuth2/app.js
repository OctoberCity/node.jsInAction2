var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
//引入处理中间件
app.use(extendAPIOutput);
app.use(apiErrorHandler);

//扩展res对象
function extendAPIOutput(req,res.next){
	res.apisuccess=function(data){
		res.json({
			status:"success",
			result:data
		});
	}
	res.apierror=function(err){
         res.json({
         	status:"error",
         	error_code:err.error_code || "UNKNOW",
         	error_message:err.error_message
         });
	}
	next();
}

//创建统一错误对象
function createError(code,mes){
 var  err = new Error(msg);
 err.error_code=code;
 err.error_message=mes;
 return err;
  
} 
 
function apiErrorHandler(err,req,res,next){
	if(typeof res.apierror==="function"){
       return  res.apierror(err);
	}
  next();
}



module.exports = app;
