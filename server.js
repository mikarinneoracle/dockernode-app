var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.npm_package_config_port;
if(process.env.USE_SESSIONS)
{
    // To support app container user-defined values
    var useSessions = process.env.USE_SESSIONS === 'true';
} else {
    // To support Docker package.json user-defined values
    var useSessions = process.env.npm_package_config_use_sessions === 'true';
}
var app = express();
var session = require('express-session');
var i = 0; // When not using sessions

module.exports = app;

if(useSessions)
{
  app.use(session(
    { secret: 'mynodejssecretXYZ123',
      resave: false, saveUninitialized: true,
      cookie: { maxAge: 60000 }
    }
  ));
}

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
    res.send({ 'i': session.i, 'useSessions': useSessions });
  } else {
    i++;
    res.send({ 'i': i , 'useSessions': useSessions });
  }
});

app.get('/exit', function(req, res) {
  process.exit();
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
    console.log("Using sessions is :" + useSessions);
});
