/* db_postgis.js
 * this is the module for accessing the postgis db
*/ 

// Includes
var pg = require('pg');
var modules = require('./../util/modules.js');
// Constants
var dbConnectionString = "postgres://xjqpynnkbyvils:Lji13-Y3pwSLzWf1_cjvv1w79P@ec2-54-235-207-226.compute-1.amazonaws.com:5432/dbcl20daau1ttt?ssl=true";


// Public methods
module.exports = {
    init: function (){
    },
    
    start: function (){
        var resourceMgr = modules.getModule('resource_manager');

        console.log('postgis module started');
    },
    
    getIssue: function (itemId, callback){
        var queryString = "SELECT * FROM issues WHERE id='" + itemId + "'";
        
        queryDbCallback(queryString, callback);
    },
    
    updateIssue: function (itemId, values){
    },
    
    addIssue: function (issue){
        var queryString = "INSERT INTO "+ getIssueSchema() + " " + createIssueQueryValue(issue);
        
        queryDb(queryString);
    },
    
    // This is an array of issues
    // Insead of one db call per issue
    // we can add many in 1 call
    addIssues: function (issues){
    },
    
    getIssuesWithinDist: function(latitude, longitude, dist, callback){
        var queryString = "SELECT id, opened, source, title, type, address, ST_X(geo_coords), ST_Y(geo_coords) FROM issues WHERE ST_DWithin(geo_coords, ST_GeomFromText('POINT(" + latitude + " " + longitude + ")',4326)," + dist + ")"
        
        queryDbCallback(queryString, callback);
    },
    
    getLastUpdated: function (source, callback){
        var queryString = "SELECT date FROM updates WHERE source='" + source + "'";
        
        queryDbCallback(queryString, function(data){
            if (data[0]){
                var date = data[0]['date'].toISOString();
                console.log(date);
                callback(date);
            }
            else{
                callback(null);
            }
        });
    },
    
    //source is the name of the source being updated eg: boston_311
    // Date is an ISO standard date eg: 2016-05-03T23:13:34.046
    setSourceUpdated: function (source, date){
        var queryString = "UPDATE updates SET date='" + date + "' WHERE source='" + source + "'";
        
        queryDb(queryString);
    },
    
    addNewSourceUpdate: function (source){
        var date = new Date().toISOString();
        date = date.replace('Z', '');
        
        var queryString = "INSERT INTO updates(source, date)\
        values('" + source + "', '" + date + "')";
        
        queryDb(queryString);
    }
}

function queryDbCallback(queryString, callback) {
    pg.connect(dbConnectionString, function(err, client, done) {
        if(err){
            console.log('failed to connect to the db');
            console.log(err);
            throw err;
        }
        
        client.query(queryString, function(err, result){
            done();
            if(err){
                return console.error(err);
            }
            callback(result.rows);
        });
    });
}

function queryDb(queryString) {
    pg.connect(dbConnectionString, function(err, client, done) {
        if(err){
            console.log('failed to connect to the db');
            console.log(err);
            throw err;
        }
        
        client.query(queryString, function(err, result){
            done();
            if(err){
                return console.error(err);
            }
        });
    });
}

function getIssueSchema(){
    return "issues(opened, source, title, type, address, source_id, geo_coords)"
}

function createIssueQueryValue(issue){
    var output = "VALUES("+
    "'" + issue.opened + "',"+
    " '" + issue.source + "',"+
    " '" + issue.title + "',"+
    " '" + issue.type + "',"+
    " '" + issue.address + "',"+
    " '" + issue.source_id + "', "+
    " ST_GeomFromText('POINT(" + issue.latitude + " " + issue.longitude + ")',4326))";    
    
    return output;
}


