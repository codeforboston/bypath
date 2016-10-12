/* rest_server.js
 * this will hold all of the rest calls for the server
*/

// Includes
var express = require('express');

var index = require('./routes/index.js');
var incident = require('./routes/incident.js');
var parking = require('./routes/parking.js');
var data = require('./routes/data.js');
var nav = require('./routes/nav.js');
var env = require('../constants/environment.js');

var ENV = env.getEnvironment();

// private memeber vars
var app;
var port;

// public methods
module.exports = {
    init: function (){
        app = express();
        
        app.use('/', index);
        app.use('/incident', incident);
        app.use('/parking', parking);
        app.use('/data', data);
        app.use('/nav', nav);
    },

    start: function (){
        port = process.env.PORT || 8080;
        console.log('rest server module started');
        var server = app.listen(port, function(){
            console.log('Server started on port: ' + port);
        });
    }
}

// private methods