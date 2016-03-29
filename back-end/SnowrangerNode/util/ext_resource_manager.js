/* key_manager.js
 * this file will load all of the keys from an external file
 * so that we can move the sensitive data out of the repo
*/

var fs = require('fs');
var path = require('path');

var KEY_FILE = 'keys.txt';

// list<id, key>
var keys = [];
var keysLoaded = false;

var RESOURCE_FILE = 'resources.txt';

// list<id, key>
var resources = [];
var resourcesLoaded = false;

// Currently this reads lines and splits on '='
// I would like to change it to reading a json file
// Also add encryption so keys are not stored in plain text
function loadKeysFromFile(file){
    if (!keysLoaded) {
        var data = getLinesFromFile(file);
        keys = load(data);
    }
}

function loadResourcesFromFile(file){
    if (!resourcesLoaded) {
        var data = getLinesFromFile(file);
        resources = load(data);
    }
}

function getLinesFromFile(file){
    var fp = path.join(__dirname, '../' + file);
    var f = fs.readFileSync(fp).toString();
    var values = f.split('\n');
    
    // We need to go though and remove all carage returns and new lines chars
    for (i in values) {
        values[i] = values[i].replace('\r', '');
    }

    return values;
}

function load(data){
    var output = [];
    
    for (i in data) {
        var line = data[i];
        var idx = line.indexOf('=');
        
        if (idx > -1) {
            // Split the string into id and key
            var id = line.substring(0, idx);
            var key = line.substring(idx + 1);
            
            // Set the id, key pair
            output[id] = key;
        }
    }
    
    return output;
}

function loadKeys () {
    keys = [];
    keysLoaded = false;
    
    loadKeysFromFile(KEY_FILE);
}

function loadResources () {
    resources = [];
    resourcesLoaded = false;
    
    loadResourcesFromFile(RESOURCE_FILE);
}

module.exports = {
    init: function (){
        // The only thing to do is load the keys
        loadKeys();
        loadResources();
    },
    
    start: function (){
        console.log('resource manager module started');
        // Nothing to do on start
    },

    getKey: function (id){

        // Check if the key exists before trying to get it out
        if (id in keys) {
            return keys[id];
        }
    },

    getResource: function (id){
        if (id in resources) {
            return resources[id];
        }
    },
}