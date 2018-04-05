// server.js

// BASE SETUP
// =============================================================================

// call the packages we need

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request    = require('request');

// Configuration
var secret = '<YOUR DIRECTLINE SECRET>';
var domain = 'https://directline.botframework.com/v3/directline';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001;        // set our port

// Express only serves static React client assets in production, in development the Webpack proxy is used
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Get a directline configuration (accessed at GET http://localhost:3001/api/config)
router.get('/config', function(req, res) {
    const options = {
        method: 'POST',
        uri: domain + '/tokens/generate',
        headers: {
            'Authorization': 'Bearer ' + secret
        },
        json: {
            TrustedOrigins: ['http://localhost:3002']
        }
    };

    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.json({ 
                    token: body.token,
                    domain: domain
                });
        }
        else {
            res.status(500).send('Call to retrieve token from DirectLine failed');
        } 
    });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Client Host is on: http://localhost:' + port);