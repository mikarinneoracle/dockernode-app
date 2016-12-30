var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.npm_package_config_port;
var app = express();
var session = require('express-session');

// Use the session middleware
app.use(session(
  { secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}
));

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/inc', function(req, res) {
  var session = req.session;
  if (session.i) {
    session.i++;
  } else {
    session.i = 1;
  }
  res.send({ "i": session.i });
});

app.get('/exit', function(req, res) {
  process.exit();
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
});
