/* incident.js
 * this file contains all the controllers for modify, add, delete for incidents
*/

// Includes
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var modules = require('./../../util/modules.js');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + "/../views/addIncident.html"));
});

router.get('/get', function (req, res) {
    db = modules.getModule('db');
    
    var latitude = req.query.x;
    var longitude = req.query.y;
    var dist = req.query.d;
    
    
    console.log('Coords(' + latitude + ', ' + longitude + ') at Distance: ' + dist);
    
    db.getIssuesWithinDist(latitude, longitude, dist, function(data){
        if (data[0] === undefined) {
            res.end('null');
        }
        else {
            console.log('data recieved from database');
            console.log('Number of items: ' + data.length);
            res.end(JSON.stringify(data));
        }
    });
    
    //res.end('recieved');
});

router.post('/addNew', urlencodedParser, function (req, res) {
    // Create the item for the db
    console.log('Adding new');
    item = {
        'id': '23456',//req.body.id,
        'title':req.body.title,
        'type': req.body.type,
        'open': new Date().toISOString().replace('Z', ''),
        'geo': req.body.geo
    };
    
    // Get the database module and give it the item to push to the db
    db = modules.getModule('db');
    db.addNewItem(item);
    
    // Just give them the json that was submitted to the db
    res.end(JSON.stringify(item));
});

router.post('/update', urlencodedParser, function(req, res){
    var id = req.body.id;
    var values = req.body.values;
    
    db = modules.getModule('db');
    
    for(i in values){
        var value = JSON.parse(values[i]);
        
        db.setItem(value['path'] +'/'+ id, value['value']);
    }
    
    res.end('thanks');
});

router.post('/add', urlencodedParser, function(req, res){
    // Get the path to add
    // Get the vaule to add
    var path = req.body.path;
    var value = req.body.value;
    
    console.log('Add recieved');
    console.log(req);
    
    db = modules.getModule('db');
    //fb.addItem(path, value);
    
    res.end('thanks');
    
});

module.exports = router;