/* incident.js
 * this file contains all the controllers for modify, add, delete for incidents
*/

// Includes
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var modules = require('./../../util/modules.js');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + "/../views/addIncident.html"));
});

router.post('/addNew', urlencodedParser, function (req, res) {
    // Create the item for the db
    console.log(req.body);
    item = {
        'id': 1234123412,
        'title':req.body.title,
        'type': req.body.type,
        'loc': req.body.loc,
        'open': new Date().toISOString().replace('Z', ''),
        'geo': {'lat': req.body.lat, 'lon': req.body.lon}
    };
    
    // Get the database module and give it the item to push to the db
    db = modules.getModule('firebase');
    db.addNewItem(item);
    
    // Just give them the json that was submitted to the db
    res.end(JSON.stringify(item));
});

router.post('/update', urlencodedParser, function(req, res){
    var id = req.body.id;
    var values = req.body.values;
    
    db = modules.getModule('firebase');
    db.updateItem(id, value);
    
});

router.post('/add', urlencodedParser, function(req, res){
    // Get the path to add
    // Get the vaule to add
    var path = req.body.path;
    var value = req.body.value;
    
    db = modules.getModule('firebase');
    fb.addItem(path, value);
    
});

module.exports = router;