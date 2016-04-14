/* NYC311.js
 * This will go out and grab relivent data from the boston's 311 data and send it to the firebase
*/

// Includes
var modules = require('./../util/modules.js');
var sql = require('./SQLData.js');

var UPDATE_PATH = '/updates/nyc_311';

var sqlScheduleQuery;

module.exports = {
    init: function (){
        sqlScheduleQuery = new sql();
    },

    start: function (){
        var resourceMgr = modules.getModule('resource_manager');

        var serviceKey = resourceMgr.getKey('soda_key');
        var queryPath = resourceMgr.getResource('nyc_311_url');
        var query = "SELECT * WHERE created_date > '$date' AND status = 'Open' AND (STARTS_WITH(complaint_type, 'Street Condition') OR STARTS_WITH(complaint_type, 'General Construction/Plumbing') OR STARTS_WITH(complaint_type, 'Street Light Condition') OR STARTS_WITH(complaint_type, 'Illegal Parking'))";

        sqlScheduleQuery.init(queryPath, query, serviceKey, UPDATE_PATH);
        sqlScheduleQuery.run('00 * * * * *', addToDb);
    }
}


// This is kind of a big deal.
function addToDb(body){
    var db = modules.getModule('firebase');
    var r = JSON.parse(body);

    console.log('adding items to bd for nyc 311');
    for (i in r) {
        try {
            item = {
                'id': r[i]['unique_key'],
                'title': r[i]['descriptor'],
                'type': r[i]['complaint_type'],
                'loc': r[i]['incident_address'] || null,
                'open': r[i]['created_date'] || null,
                'geo': r[i]['latitude'] + ',' + r[i]['longitude'],
                'source' : 'nyc311',
            };
            db.addNewItem(item);
        }
        catch (e) {
            console.log('error in creating new item');
            console.log(e);
        }
    }
}
