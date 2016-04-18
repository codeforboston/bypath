var modules = require('./../util/modules.js');
var sql = require('./SQLData.js');

var UPDATE_ROOT = 'updates/';

// Name - string: object identifer
// url - string: of the url to query
// key - string: access key for the query
// query - string: the sql query
// map - json: a mapping from the query to the our object schema
function Endpoint(name, url, key, query, map){
    this.name = name;
    this.url = url;
    this.key = key;
    this.query = query;
    this.map = map;
    
    this.scheduler;
    
    // This just prints out all members of this class
    Endpoint.prototype.print = function(){
        console.log("----- Endpoint Begin -----");
        console.log("Name: " + this.name);
        console.log("Url: " + this.url);
        console.log("Key: " + this.key);
        console.log("Query: " + this.query);
        console.log(this.map);
        console.log("----- Endpoint End -----");
    }
    
    Endpoint.prototype.init = function(){
        this.scheduler = new sql();
    }
    
    // timerSchedule: string in a cron job schedule format eg: "* * * * * *"
    Endpoint.prototype.start = function(timerSchedule){
        this.scheduler.init(this.url, this.key, this.query, UPDATE_ROOT + this.name);
        this.scheduler.run(timerSchedule, this.addItems.bind(this));
    }
    
    // obj: json object
    // prop: string to search the json object
    // This returns a value from a nested json object
    // seperated by '.'
    // eg point.x would return obj['point']['x']
    function findProp(obj, prop){
        var defval = null;
        var props = prop.split('.');
        for (var i = 0; i < props.length; i++) {
            if(typeof obj[props[i]] == 'undefined'){
                console.log('could not find property ' + prop);
                return defval;
            }
            obj = obj[props[i]];
        }
        return obj;
    }
    
    // Body: Array of json objects
    Endpoint.prototype.addItems = function(body){
        var db = modules.getModule('firebase');
        var r = JSON.parse(body);

        console.log('adding items from ' + this.name);
        
        for (i in r) {
            try {
                // I pull the values out of the json object first
                // so if I am missing any it will throw an error
                // and not add the object
                var id = this.map['id'];
                var title = this.map['title'];
                var type = this.map['type'];
                var location = this.map['location'];
                var open = this.map['open'];
                var lat = this.map['latitude'];
                var lon = this.map['longitude'];
                
                item = {
                    'id': findProp(r[i], id),
                    'title': findProp(r[i], title),
                    'type': findProp(r[i], type),
                    'location': findProp(r[i], location),
                    'open': findProp(r[i], open),
                    'geo': findProp(r[i], lat) + ',' + findProp(r[i], lon),
                    'source': this.name,
                };
                
                db.addNewItem(item);
            }
            catch (e) {
                console.log('error in creating new item');
                console.log(e);
            }
        }    
    }
}

module.exports = {
    // j - json: list of json objects
    createEndpoints: function(j){
        var endpoints = [];
        var resourceMgr = modules.getModule('resource_manager');
        
        for(i in j){
            var name = i;
            
            var url = j[i]['url'];
            var keyName = j[i]['key']; // Key needs to be loaded from the keys.txt file
            var key = resourceMgr.getKey(keyName);
            var query = j[i]['query'];
            var map = j[i]['map'];
            
            var e = new Endpoint(name, url, key, query, map);
            
            endpoints.push(e);
        }
        
        return endpoints;
    }
}