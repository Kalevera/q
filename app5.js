var express = require('express'),
    helmet = require('helmet'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
     token = require('./config/token'), // this is here to make it easy to change the server token secret
    mongoose =require('mongoose');

var refreshDirect = require('./routes/re'), // since this is linked to an angular SPA this will redirect traffic to the landing page of the SPA
    // refresh redirect doesn't handle all refresh calls or direct calls to server.

    routes = require('./routes/index'); // this is here to add routes to manipulate for the presentation currently not being used

var  app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('superSecret', token.secret);

app.use(helmet()); // this is a general protection middleware for common node server attacks excludes Csrf
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/u/', refreshDirect); // any route which hits the server request containing /u/ at the top level will be redirected will not work if /a/u/ because /u/ is not at the top of the route request. It's labeled /u/ to represent basic user access in the route I chose this.

var auth_api = require('./routes/auth_api')(app), // sets cookies makes token updates to the database and checks to see if the user can use the routes that are initialized below
     user_api = require('./routes/user_api')(app); // this will be affected by the middleware in auth_api.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
