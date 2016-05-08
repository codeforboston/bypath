/* db.js
 * this is the module for accessing the postgis db
*/ 

// Includes
var post_db = require('./db_postgis.js');

// Public methods
module.exports = {
    init: function (){
        //db.init();
    },
    
    start: function (){
        //db.start();
    },
    
    getIssue: function (id, onComplete){
    },

    addIssue: function (issue){
        post_db.addIssue(issue);
    },
    
    updateIssue: function (itemId, values){
    },
    
    getIssuesWithinDist (point, dist, callback){
        post_db.getIssuesWithinDist(point, dist, callback);
    },
    
    getLastUpdated: function (source, callback){
        post_db.getLastUpdated(source, callback);
    },
    
    //source is the name of the source being updated eg: boston_311
    // Date is an ISO standard date eg: 2016-05-03T23:13:34.046
    setSourceUpdated: function (source, date){
        post_db.setSourceUpdated
    },
    
    addNewSourceUpdate: function(source){
        post_db.addNewSourceUpdate(source);
    }
}