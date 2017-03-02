require('dotenv').load();




var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var dbConfig = require('./db');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

// Connect to DB
mongoose.connect(dbConfig.url);

var app = express();
var timeline = require('./routes/timeline')
var tech_support = require('./routes/tech_support')
var tech_support_public = require('./routes/tech_support_public')
var shopify_transactions = require('./routes/shopify_transaction')
var shopify_product = require('./routes/shopify_product')
var shopify_product_status_app = require('./routes/shopify_product_status_app')
var shopify_aggregate = require('./routes/shopify_aggregate')
var logging_messages = require('./routes/logging_messages')
var check_ticket_file = require('./routes/check_csv_ticket_file')
var check_ticket_database = require('./routes/check_ticket_database')



var shopify = require('./routes/shopify')
var team = require('./routes/team')
var leave = require('./routes/leave')
var timeline_data_settings = require('./routes/timeline_data_settings')
var user_data = require('./routes/user_data')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(__dirname + '/lib/'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
//var flash = require('connect-flash');
var flash = require('express-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use('/timeline', timeline);
app.use('/tech_support', tech_support);
app.use('/tech_support_public', tech_support_public);

app.use('/shopify', shopify);
app.use('/team', team);
app.use('/leave', leave);
app.use('/timeline_data_settings', timeline_data_settings);
app.use('/user_data', user_data);
app.use('/shopify_transactions', shopify_transactions);
app.use('/shopify_product', shopify_product);
app.use('/shopify_product_status_app', shopify_product_status_app);
app.use('/logging_messages', logging_messages);
app.use('/shopify_aggregate', shopify_aggregate);
app.use('/check_ticket_file', check_ticket_file);
app.use('/check_ticket_database', check_ticket_database);


if(process.env.machine=="turnstile"){
	console.log('loading turnstile files')
	
	var Port_control= require('./data_loader/turnstiles/serialport-terminal')
		port_control=new Port_control()
		
	
	var Turnstile_control= require('./data_loader/turnstiles/turnstile-controller')
		turnstile_control = new Turnstile_control()
		var valid_tickets = turnstile_control.connect() 
		var port = port_control.open_port(valid_tickets)
		

	
}
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
module.exports = app;



