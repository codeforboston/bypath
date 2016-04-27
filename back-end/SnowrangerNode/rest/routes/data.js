// Includes
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var modules = require('./../../util/modules.js');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/addEndpoint', urlencodedParser, function (req, res) {
    console.log('got something');
    
    var dm = modules.getModule('data_manager');
    var j = req.body;
    
    var newEndpoint = {};
    newEndpoint[j.name] = {
        'url': j.url,
        'key': j.key,
        'query': j.query,
        'map': {
            'id': j.id,
            'title': j.title,
            'type': j.type,
            'location': j.location,
            'open': j.open,
            'latitude': j.latitude,
            'longitude': j.longitude
        }
    };

    var endpointAdded = dm.addEndpoint(newEndpoint);
    
    if (endpointAdded) {
        res.end('endpoint added');
    }
    else {
        res.end('invalid endpoint data');
    }    
});

module.exports = router;