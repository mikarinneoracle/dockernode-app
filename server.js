var express = require('express');
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
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

/**
 * @swagger
 * /inc:
 *   get:
 *     tags:
 *       - Inc
 *     description: <div>A very simple service.<br></div>
 *                  <div>Returns the increment of i by 1 in memory.</div>
 *                  <div>If environment's <b>useSessions=true</b>, returns the increment of i from user's session.</div>
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userid
 *         description: Users's id
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Returns the incremented value of i by 1. Also returns the boolean value of useSessions.
 *         schema:
 *           properties:
 *            i:
 *              type: integer
 *            useSessions:
 *              type: boolean
 */

app.get('/inc/', function(req, res) {
  var userid = req.query.userid; // Optional
  var result;
  if(useSessions)
  {
    var session = req.session;
    if (session.i != null)
    {
      session.i++;
    } else {
      console.log("A new session " + (userid ? userid : ''));
      session.i = 0;
    }
    req.session.save();
    result = session.i;
  } else {
    result = i++;
  }
  if(userid)
  {
    res.send({ 'i': result , 'useSessions': useSessions, 'userid':userid });
  } else {
    res.send({ 'i': result , 'useSessions': useSessions });
  }
});

app.get('/exit', function(req, res) {
  process.exit();
});

app.listen(port, function() {
  	console.log('server listening on port ' + port);
    console.log("Using sessions is :" + useSessions);
});

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Docker Node.js RESTful API with Swagger',
  },
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./server.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
