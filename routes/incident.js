/* incident.js
 * this file contains all the controllers for modify, add, delete for incidents
*/

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//var firebase = require('firebase');
var db_fb = require('./../database/db_firebase.js');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })




router.get('/', function (req, res) {
	console.log(new Date());
	res.sendFile(path.resolve(__dirname + "/../views/addIncident.html"));
});

router.post('/add', urlencodedParser, function (req, res) {
	
    response = {
        'id': 1234123412,
		'title':req.body.title,
		'type': req.body.type,
        'loc': req.body.loc,
        'open': new Date().toISOString(),
		'geo': {'lat': req.body.lat, 'lon': req.body.lon}
	};
    
    db_fb.addItem(response);

	res.end(JSON.stringify(response));
});

module.exports = router;