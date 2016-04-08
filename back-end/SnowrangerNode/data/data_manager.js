/* data_manager.js
 * this module will get and manage the data that is stored in the database
*/

var b311 = require('./Boston311.js');
var sf311 = require('./SF311.js');

// These are the data sources
var endpoints = [];

module.exports = {
    init: function (){
        endpoints.push(b311);
        endpoints.push(sf311);
        
        for (i in endpoints) {
            endpoints[i].init();
        }
    },

    start: function (){
        console.log('data manager module started');
        
        for (i in endpoints) {
            endpoints[i].start();
        }
    },
}