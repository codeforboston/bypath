/* data_manager.js
 * this module will get and manage the data that is stored in the database
*/

var builder = require('./endpointBuilder.js');
var modules = require('./../util/modules.js');

var scheduleTile = 0;
var scheduleAdvance = 5;
// These are the data sources
var endpoints = [];

function getNextSchedule(){
    scheduleTile += scheduleAdvance;
    return "00 " + ("0" + scheduleTile).slice(-2) + " * * * *";
}

module.exports = {
    init: function (){
    },

    start: function (){
        
        var resourceMgr = modules.getModule('resource_manager');
        eps = resourceMgr.getResource('endpoints');
        
        console.log(endpoints);
        
        endpoints = builder.createEndpoints(eps);
        
        for (i in endpoints) {
            endpoints[i].init();
            endpoints[i].print();
        }

        console.log('data manager module started');

        // Begin scheduler at 5 mins because most 311's
        // post their data on the hour so I want to wait until
        // after that before cheking for new stuff
        var nextSchedule = 5;

        for (i in endpoints) {
            endpoints[i].start(getNextSchedule());
        }
    },
    
    // Create an object from json
    // endpointJson is a json object of the data to be added
    // The format this is in is { "<source name>" : { data } }
    // data has the query info and the mapping info
    // Refer to endpointBuilder.js addIems function for more info on the strucutre
    addEndpoint: function (endpointJson){

        for (i in endpointJson) {
            var endpoint = builder.createEndpoint(i, endpointJson[i]);

            endpoint.init();

            if (endpoint.isVaild()) {
                endpoint.forceUpdate();
                endpoint.start(getNextSchedule());
                
                endpoints.push(endpoint);
                
                return true;
            }
        }
        
        console.log('invalid data for endpoint');

        return false;
    },

    forceUpdate: function () {
        for (i in endpoints) {
            endpoints[i].forceUpdate();
        }
    },
}
