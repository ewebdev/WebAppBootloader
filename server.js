var express = require('express')
	, http = require('http')
	, path = require('path')
	, fs = require('fs');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 5000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'assets')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});


app.get('/', function (req, res) {
	res.render('index');
});

require('./updateResourcesVer');

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
