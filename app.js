var express = require('express')
	, http = require('http')
	, path = require('path')
	, fs = require('fs');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('connect-coffee-script')({
		src: __dirname + '/assets',
		bare: true
	}));
	app.use(require('less-middleware')({ src: __dirname + '/assets' }));
	app.use(express.static(path.join(__dirname, 'assets')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});


app.get('/', function (req, res) {
	res.render('index', { title: 'Express' });
});

app.get('/config-examples/:filename', function (req, res) {
	var filename = req.params.filename;
	fs.readFile('./assets/config-examples/' + filename, function (err, data) {
		if (err) {
			res.send(500);
		} else {
			res.send(data.toString());
		}
	});
});

require('./updateResourcesVer');

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
