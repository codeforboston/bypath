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

    dm.addEndpoint(newEndpoint);

    //for (i in req.body) {
    //    var newEndpoint = JSON.parse(i);

    //    dm.addEndpoint(newEndpoint);
    //}

    res.end('endpoint added');
});

module.exports = router;