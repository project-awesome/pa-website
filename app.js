var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');

var favicon = require('serve-favicon');

// Refreshing the page sometimes rendered an empty html page. app.disable('etag'); fixes it.
app.disable('etag');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


// passport initialization
app.use(session( { 
	secret: process.env.SESSION_SECRET || 'some_default_secret_for_project_awesome',
	resave: true,
	saveUninitialized: true
} ));
app.use(passport.initialize());
app.use(passport.session());





require('./config/passport.js')(passport);



// routes ======================================================================
app.use(function logHttpRequest(req, res, next) {
	var msg = req.method + " " + req.url;
	if (JSON.stringify(req.body) != "{}") {
		msg = msg + "  params: " + JSON.stringify(req.body);
	}
	console.log(msg);
    next();
})
require('./routes')(app, passport);


// Exports application for testing
module.exports = app;

