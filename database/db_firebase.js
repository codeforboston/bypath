/* db_firebase.js
 * this is the module for accessing the firebase db
*/ 

// Includes
var firebase = require('firebase');

// Constants
var MASTER = 'MASTER';
var VALUE = 'VALUE'
var PATH = 'PATH';
var DATA = 'DATA';

// Private vars
var firebase_url;
var fbRef;

// Public methods
module.exports = {
    init: function (){
        // This link will need to get moved to the key file at some point
        firebase_url = "https://alexdev.firebaseio.com/";
        fbRef = new firebase(firebase_url);
    },
    
    start: function (){

    },

    addItem: function (data){
        // generate the schema from the data passed in

        var result = generateSchema(data);
        //console.log(result);
        
        // Get the master
        master = result[MASTER];
        
        // We set the id of the relitive tables based on what is generated when master is added to the db
        var response = fbRef.child(master[PATH]).push(master[DATA]);

        var values = result[VALUE];
        
        // Iter though each item in the schema and set them on the db relitive to their path
        for (i in values) {
            var item = values[i];
            fbRef.child(item[PATH] + '/' + response.path.u[1]).set(item[DATA]);
        }
        
        
    }
}

// Private functions
function generateSchema(data) {
    // Grab change the data's format to fit the db
    // in the form of <path>: <values>
    var values = [];

    values.push(createSchemaItem('/open', data['open']));
    values.push(createSchemaItem('/type', data['type']));
    values.push(createSchemaItem('/title', data['title']));
    values.push(createSchemaItem('/location', data['loc']));
    values.push(createSchemaItem('/geo', data['geo']));
    
    var output = {
        MASTER: createSchemaItem('/master', { 'id': data['id'] }),
        VALUE : values
    }
    
    return output;
}

// Simple helper function for normailzing the data being sent to the server
function createSchemaItem(path, item) {
    return { PATH : path, DATA : item };
}