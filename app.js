const express = require('express');
const path = require('path');
const loggerMorgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// routers
 
 

const app = express();



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(loggerMorgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db connection
const db = require('./helper/db.js')();
const logger = require('./helper/logger.js');

// Batch Jobs
 

const config = require('./config');
app.set('api_secret_key', config.api_secret_key);
 
// Middleware
const verifyToken = require('./middleware/verify-token');


//local origin
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
  
  next();
});*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use('/api', verifyToken);
//app.use('/', global);
 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
   
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

   // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);


    res.render(err);
  //res.send(res);
  res.end();
   
});





module.exports = app;
