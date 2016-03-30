/* rest_server.js
 * this will hold all of the rest calls for the server
*/

// Includes
var express = require('express');

var index = require('./routes/index.js');
var incident = require('./routes/incident.js');
//var keymanager = require('./auth/keymanager.js');

// private memeber vars
var app;
var port;

// public methods
module.exports = {
    init: function (){
        app = express();
        
        app.use('/', index);
        app.use('/incident', incident);
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

var connect = require('connect');
var serveStatic = require('serve-static');
var port = process.env.PORT || 8080;
connect().use(serveStatic(__dirname)).listen(port);