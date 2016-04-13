/* boston311.js
 * This will go out and grab relivent data from the boston's 311 data and send it to the firebase
*/ 

// Includes
var modules = require('./../util/modules.js');
var sql = require('./SQLData.js');

var UPDATE_PATH = '/updates/sf_311';

var sqlScheduleQuery;

module.exports = {
    init: function (){
        sqlScheduleQuery = new sql();
    },

    start: function (){
        var resourceMgr = modules.getModule('resource_manager');
        
        var serviceKey = resourceMgr.getKey('soda_key');
        var queryPath = resourceMgr.getResource('sf_311_url');
        var query = "SELECT * WHERE opened > '$date' AND status = 'Open' AND STARTS_WITH(category, 'Sidewalk or Curb')";
        
        sqlScheduleQuery.init(queryPath, query, serviceKey, UPDATE_PATH);
        sqlScheduleQuery.run('00 * * * * *', addToDb);
    }
}


// This is kind of a big deal. 
function addToDb(body){
    var db = modules.getModule('firebase');
    var r = JSON.parse(body);

    console.log('adding items to bd for sf 311');
    for (i in r) {
        try {
            var lat;
            var lon;
            
            var point = r[i]['point'];
            
            lat = point['latitude'];
            lon = point['longitude'];            
            
            item = {
                'id': r[i]['case_id'],
                'title': r[i]['request_details'],
                'type': r[i]['category'],
                'loc': r[i]['address'] || null,
                'open': r[i]['opened'] || null,
                'geo': lat + ',' + lon,
                'source' : 'sf311',
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
