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

// public methods
module.exports = {
    init: function (){
        app = express();
        
        app.use('/', index);
        app.use('/incident', incident);
    },

    start: function (){
        
        var server = app.listen(8080, function () {
        });
    }
}

// private methods