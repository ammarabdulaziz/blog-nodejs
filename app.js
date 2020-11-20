var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var fileUpload = require('express-fileupload');
var db = require('./config/connection');
var passport = require('passport');
var session = require('express-session');

var blogRouter = require('./routes/blogRouter');
var adminRouter = require('./routes/adminRouter');

var app = express();

// Passport Config
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/'
}));

var hbs = hbs.create({});

// register new function
hbs.handlebars.registerHelper("check", function (x, y, options) {
  console.log('--------- x', x)
  console.log('--------- y', y)
  if (x == y) {
    return options.fn(this);
  }
});
// hbs.handlebars.registerHelper( "when",function(operand_1, operator, operand_2, options) {
//   var operators = {
//    'eq': function(l,r) { return l == r; },
//    'noteq': function(l,r) { return l != r; },
//    'gt': function(l,r) { return Number(l) > Number(r); },
//    'or': function(l,r) { return l || r; },
//    'and': function(l,r) { return l && r; },
//    '%': function(l,r) { return (l % r) === 0; }
//   }
//   , result = operators[operator](operand_1,operand_2);

//   if (result) return options.fn(this);
//   else  return options.inverse(this);
// });

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: "key", cookie: { maxAge: 600000 } }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // console.log('req.session: ',req.session)
  // console.log('req.user: ',req.user)
  next()
})



app.use(express.static(path.join(__dirname, 'public')));

//Call db connection
db.connect((err) => {
  if (err) console.log("Connection error" + err);
  else console.log("Database connected Successfully");
});

app.use('/', blogRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
