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
var firebase_url = "https://alexdev.firebaseio.com/";
var fbRef = new firebase(firebase_url);

// Public methods
module.exports = {
    init: function (){

    },
    
    start: function (){

    },

    addItem: function (data){
        // generate the schema from the data passed in

        var result = generateSchema(data);
        //console.log(result);
        
        // Get the master
        master = result[MASTER];
        
        var response = fbRef.child(master[PATH]).push(master[DATA]);
        
        console.log(response.path.u[1]);

        var values = result[VALUE];
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
    //output['/master'] = { 'id': data['id'] };
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

function createSchemaItem(path, item) {
    return { PATH : path, DATA : item };
}