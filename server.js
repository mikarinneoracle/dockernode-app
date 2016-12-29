var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.npm_package_config_port;
var app = express();
var i = 0;

app.get('/', function(req, res) {
  i++;
	res.send('hello world ' + i + ' times from port ' + port);
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
});
