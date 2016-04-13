/* boston311.js
 * This will go out and grab relivent data from the boston's 311 data and send it to the firebase
*/ 

// Includes
var modules = require('./../util/modules.js');
var sql = require('./SQLData.js');

var getMeASoda = require('./getMeASoda.js');
var justPlainCoke = require('./justPlainCoke.js');

var UPDATE_PATH = '/updates/bos_311';

var sqlScheduleQuery;

module.exports = {
    init: function (){
        sqlScheduleQuery = new sql();
    },

    start: function (){
        var resourceMgr = modules.getModule('resource_manager');
        
        serviceKey = resourceMgr.getKey('soda_key');
        queryPath = resourceMgr.getResource('boston_311_url');

        // var query = getMeASoda.query(justPlainCoke);
        var query = "SELECT * WHERE open_dt > '$date' AND CASE_STATUS = 'Open' AND (STARTS_WITH(case_title, 'Unsafe/Dangerous Conditions') OR STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Request for Snow Plowing') OR STARTS_WITH(case_title, 'Park Maintenance'))";
        
        sqlScheduleQuery.init(queryPath, query, serviceKey, UPDATE_PATH);
        sqlScheduleQuery.run('20 * * * * *', addToDb);

    }
}

// This is kind of a big deal. 
function addToDb(body){
    var db = modules.getModule('firebase');
    var r = JSON.parse(body);

    console.log('adding items from boston 311');
    
    for (i in r) {
        try {
            item = {
                'id': r[i]['case_enquiry_id'],
                'title': r[i]['case_title'],
                'type': r[i]['type'],
                'loc': r[i]['location'] || null,
                'open': r[i]['open_dt'] || null,
                'geo': r[i]['latitude'] + ',' + r[i]['longitude'],
                'source': 'b311',
            };
            //console.log(item);
            
            db.addNewItem(item);
        }
        catch (e) {
            console.log('error in creating new item');
            console.log(e);
        }
    }    
}
