var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.npm_package_config_port;
var app = express();
var i = 0;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/inc', function(req, res) {
  i++;
  res.send({ "i": i });
});

app.get('/exit', function(req, res) {
  process.exit();
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
});
