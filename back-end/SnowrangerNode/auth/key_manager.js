/* key_manager.js
 * this file will load all of the keys from an external file
 * so that we can move the sensitive data out of the repo
*/

var fs = require('fs');

var KEY_FILE = 'keys.txt';

// list<id, key>
var keys = [];
var keysLoaded = false;

// Currently this reads lines and splits on '='
// I would like to change it to reading a json file
// Also add encryption so keys are not stored in plain text
function loadKeysFromFile(file){
    if (!keysLoaded) {
        var file = fs.readFileSync(file).toString();
        var lines = file.toString().split('\n');
        
        // Itr though the lines 
        for (i in lines) {
            var line = lines[i];
            var idx = line.indexOf('=');
            
            if (idx > -1) {
                // Split the string into id and key
                var id = line.substring(0, idx);
                var key = line.substring(idx + 1);
                
                // Set the id, key pair
                keys[id] = key;
            }
            
            keysLoaded = true;
        }
    }
}

function addKey(id, key){
    keys[id] = key;
}

module.exports = {
    init: function (){
        // The only thing to do is load the keys
        loadKeysFromFile(KEY_FILE);
    },
    
    start: function (){
        console.log('key manager module started');
        // Nothing to do on start
    },

    reloadKeys: function () {
        keys = [];
        keysLoaded = false;

        loadKeysFromFile(KEY_FILE);
    },

    getKey: function (id){

        // Check if the key exists before trying to get it out
        if (id in keys) {
            return keys[id];
        }
    }
}