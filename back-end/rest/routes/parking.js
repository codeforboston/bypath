/* incident.js
 * this file contains all the controllers for modify, add, delete for incidents
*/

// Includes
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var modules = require('./../../util/modules.js');
var env = require('../../constants/environment.js');

var ENV = env.getEnvironment();

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/get', function (req, res) {
    db = modules.getModule('db');

    var latitude = req.query.x;
    var longitude = req.query.y;
    var dist = req.query.d;


    console.log('Coords(' + latitude + ', ' + longitude + ') at Distance: ' + dist);

    var data = [
        {"id":2,"opened":"2016-04-20T16:04:00.000Z","source":"boston_311","title":"Unsafe/Dangerous Conditions","type":"Unsafe Dangerous Conditions","address":"22 Kenilworth St  Roxbury  MA  02119","latitude":42.3285,"longitude":-71.0873},
        {"id":3,"opened":"2016-04-20T16:04:00.000Z","source":"boston_311","title":"Unsafe/Dangerous Conditions","type":"Unsafe Dangerous Conditions","address":"22 Kenilworth St  Roxbury  MA  02119","latitude":42.3285,"longitude":-71.0873}];

    res.setHeader('Access-Control-Allow-Origin', ENV.ACCESS_ORIGIN_URL);// convert this to a resource
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.end(JSON.stringify(data));

    return;

    db.getIssuesWithinDist(latitude, longitude, dist, function(data){
        if (data[0] === undefined) {
            res.end('null');
        }
        else {
            console.log('data recieved from database');
            console.log('Number of items: ' + data.length);

            res.setHeader('Access-Control-Allow-Origin', ENV.ACCESS_ORIGIN_URL);// convert this to a resource
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.end(JSON.stringify(data));
        }
    });

    //res.end('recieved');
});

module.exports = router;
