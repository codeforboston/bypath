/* incident.js
 * this file contains all the controllers for modify, add, delete for incidents
*/

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var modules = require('./../../util/modules.js');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/addIncident.html"));
});

router.post('/add', urlencodedParser, function (req, res) {
	
    item = {
        'id': 1234123412,
		'title':req.body.title,
		'type': req.body.type,
        'loc': req.body.loc,
        'open': new Date().toISOString(),
		'geo': {'lat': req.body.lat, 'lon': req.body.lon}
	};
    
    // This needs to get send to a module for sending to the database
    fb = modules.getModule('firebase');
    tst = modules.getModules();
    fb.addItem(item);

	res.end(JSON.stringify(item));
});

module.exports = router;