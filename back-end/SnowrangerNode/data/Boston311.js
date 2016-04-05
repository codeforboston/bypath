/* boston311.js
 * This will go out and grab relivent data from the boston's 311 data and send it to the firebase
*/ 

// Includes
var modules = require('./../util/modules.js');
var cronJob = require('cron').CronJob;
var request = require('request');

var UPDATE_PATH = '/updates/311';

// This should fix heroku
var serviceKey;
var queryPath;

// Not sure why I am caching this.
// Maybe in case I need to stop it
var cJob;

module.exports = {
    init: function (){

    },

    start: function (){
        var resourceMgr = modules.getModule('resource_manager');
        
        serviceKey = resourceMgr.getKey('boston_311_key');
        queryPath = resourceMgr.getResource('boston_311_url');

        // Create the cron job and start it
        //retieve311Data();
        cJob = new cronJob('00 05 * * * *', retieve311Data, null, true, 'UTC');
    }
}

function retieve311Data() {
    var db = modules.getModule('firebase');

    db.getItem(UPDATE_PATH, function (data) {
        var date = data;
        if (data === null) {
            // Create a formated date that we can use if one does not exist
            var date = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
            date = date.replace('Z', '');
        }
        
        query311(date, function (res) {
            // Add the result of the query to the db
            addToDb(res);
            
            // Might want to do some checks to make sure there were no errors when
            // sending the data to the db before setting the last upated time
            console.log('Got latest boston 311 data');
            db.setItem(UPDATE_PATH, new Date().toISOString().replace('Z', ''));
        });
    });
}

function query311(date, callback){    
    // Need to add based on case types
    var stmnt = "SELECT * WHERE open_dt > '" + date + "' AND CASE_STATUS = 'Open' AND (STARTS_WITH(case_title, 'Unsafe/Dangerous Conditions') OR STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Request for Snow Plowing') OR STARTS_WITH(case_title, 'Park Maintenance'))";
    var query = queryPath + stmnt;

    var options = {
        method: 'GET',
        url: query,
        headers: {
            'X-App-Token': serviceKey
        }
    };

    var req = request(options, function (error, response, body) {
        console.log('response: ' + response.statusCode);
        if (error) {
            console.log(error);
        }
        else {
            callback(body);
        }
    });
}

// This is kind of a big deal. 
function addToDb(body){
    var db = modules.getModule('firebase');
    var r = JSON.parse(body);

    for (i in r) {
        try {
            item = {
                'id': r[i]['case_enquiry_id'],
                'title': r[i]['case_title'],
                'type': r[i]['type'],
                'loc': r[i]['location'] || null,
                'open': r[i]['open_dt'] || null,
                'geo': r[i]['latitude'] + ',' + r[i]['longitude']
            };
            
            db.addNewItem(item);
        }
        catch (e) {
            console.log('error in creating new item');
            console.log(e);
        }
    }    
}
