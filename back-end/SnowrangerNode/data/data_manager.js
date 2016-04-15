/* data_manager.js
 * this module will get and manage the data that is stored in the database
*/


var builder = require('./endpointBuilder.js');
var modules = require('./../util/modules.js');

// These are the data sources
var endpoints = [];

module.exports = {
    init: function (){
        //endpoints.push(b311);
        //endpoints.push(sf311);
        
        var resourceMgr = modules.getModule('resource_manager');
        eps = resourceMgr.getResource('endpoints');
        
        console.log(endpoints);
        
        endpoints = builder.createEndpoints(eps);
        
        for (i in endpoints) {
            endpoints[i].init();
            endpoints[i].print();
        }
    },

    start: function (){
        console.log('data manager module started');
        
        // Begin scheduler at 5 mins because most 311's
        // post their data on the hour so I want to wait until
        // after that before cheking for new stuff
        var nextSchedule = 5;
        
        for (i in endpoints) {
            
            // Normal Scheduling.
            // Have every scheduled even run 5 mins after
            var timer = "* " + ("0" + nextSchedule).slice(-2) + " * * * *";
            nextSchedule += 5;
            
            // Faster timer for testing
            //var timer = ("0" + nextSchedule).slice(-2) + " * * * * *";
            //nextSchedule += 30;
            //console.log(timer);
            
            endpoints[i].start(timer);
        }
    },
}