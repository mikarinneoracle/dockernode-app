var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;
var app = express();

app.get('/', function(req, res) {
	res.send('hello world');
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
});
