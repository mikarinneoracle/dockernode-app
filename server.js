var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.npm_package_config_port;
var app = express();
var i = 0;

app.get('/', function(req, res) {
	res.send('use<ul><li><a href="/inc">to increase i</a></li>' +
           '<li><a href="/exit">to exit</a></li></ul>');
});

app.get('/inc', function(req, res) {
  i++;
	res.send('hello world ' + i + ' times from port ' + port);
});

app.get('/exit', function(req, res) {
  process.exit();
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
});
