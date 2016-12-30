var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.npm_package_config_port;
var useSessions = process.env.USE_SESSIONS === "true";
var app = express();
var session = require('express-session');
var i = 0; // When not using sessions

// Use the session middleware
app.use(session(
  { secret: 'mynodejssecretXYZ123', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 }}
));

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/inc', function(req, res) {
  if(useSessions)
  {
    var session = req.session;
    if (session.i) {
      session.i++;
    } else {
      session.i = 1;
    }
    res.send({ "i": session.i });
  } else {
    i++;
    res.send({ "i": i });
  }
});

app.get('/exit', function(req, res) {
  process.exit();
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
});
