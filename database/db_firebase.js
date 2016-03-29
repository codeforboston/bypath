/* db_firebase.js
 * this is the module for accessing the firebase db
*/ 

// Includes
var firebase = require('firebase');
var modules = require('./../util/modules.js');
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
        // Nothing initialize
        //firebase_url = 'https://alexdev.firebaseio.com/'//resourceMgr.getResource('firebase_url');
        //fbRef = new firebase(firebase_url);
    },
    
    start: function (){
        var resourceMgr = modules.getModule('resource_manager');
        firebase_url = resourceMgr.getResource('firebase_url');
        fbRef = new firebase(firebase_url);

        console.log('firebase module started');
    },
    
    getItem: function (path, onComplete){
        // Async call the callback once the request has completed
        fbRef.child(path).once('value', function (snapshot) {
            onComplete(snapshot.val());
        });
    },

    addNewItem: function (data){
        // generate the schema from the data passed in
        var result = generateSchema(data);
        
        // Get the master
        master = result[MASTER];
        
        // We set the id of the relitive tables based on what is generated when master is added to the db
        var response = fbRef.child(master[PATH]).push(master[DATA]);

        var values = result[VALUE];
        
        // Iter though each item in the schema and set them on the db relitive to their path
        for (i in values) {
            var item = values[i];
            
            fbRef.child(item[PATH] + '/' + response.key()).set(item[DATA]);
        }
    },
    
    // values will be in the format of 
    // [{path: path, data: value }, ...]
    // Say we are updating the title it would be
    // itemId = "-KCSxk6n0DImMtOLx88K"
    // values = [{path:title, value:'tree in park'}]
    updateItem: function (itemId, values){
        for(i in values){
            var value = values[i];
            
            setItem(value[PATH] + "/" + itemId, value[DATA]);
        }
    },
    
    addItem: function (path, value){
        fbRef.child(path).push(value);
    },

    setItem: function (path, value){
        fbRef.child(path).set(value);
    },
    
    
}

// Private functions
function generateSchema(data) {
    // Grab change the data's format to fit the db
    // in the form of <path>: <values>
    var values = [];

    values.push(createSchemaItem('/open', data['open']));
    values.push(createSchemaItem('/type', data['type']));
    values.push(createSchemaItem('/title', data['title']));
    values.push(createSchemaItem('/location', data['loc'] || null));
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


