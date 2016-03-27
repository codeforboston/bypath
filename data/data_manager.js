/* data_manager.js
 * this module will get and manage the data that is stored in the database
*/

var b311 = require('./Boston311.js');

// These are the data sources
var endpoints = [];

module.exports = {
    init: function (){
        b311.init();
    },

    start: function (){
        console.log('data manager module started');
        b311.start();
    },

    addEndpoint: function (endpoint){
        endpoints.push(endpoint);
    }
}