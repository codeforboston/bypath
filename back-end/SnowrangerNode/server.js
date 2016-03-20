/* server.js 
 * this is going to be the main entry point for the application
 * this will launch all of the processes and maanged the modules
*/

// Application entry point
function main(){
    var server = new Server();
    server.init();
}

// Includes
var modules = require('./util/modules.js');

var rest_server = require('./rest/rest_server.js');
var firebase = require('./database/db_firebase.js');
var key_manager = require('./auth/key_manager.js');
var data_manager = require('./data/data_manager.js');

function Server(){
    // Private vars
    var MODULE_NAME_IDX = 0;
    var MODULE_OBJECT_IDX = 1;
    
    // Public methods
    Server.prototype.init = function () {
        // System is the list of systems that are created and used by this server
        // They are in the format of [0]module name, [1]module object
        // I might want to move this so it is confined 
        systemList = [
            ['rest_server', rest_server],
            ['firebase', firebase],
            ['key_manager', key_manager],
            ['data_manager', data_manager]
        ];
        
        createSystems(systemList);
        startModules();
    }
    
    // Private methods
    function createSystems(systemList) {
        for (i in systemList) {
            var modName = systemList[i][MODULE_NAME_IDX];
            var modObject = systemList[i][MODULE_OBJECT_IDX];
            
            // The order we initialize and add the object to the modules list 
            // shouldn't matter since module::init() should not ref other modules
            modules.addModule(modName, modObject);
            
            modObject.init();
        }
    }

    function startModules(){
        // I might want to move this to the modules module
        var mods = modules.getModules();
        
        // Iter though the modules and tell them to start
        for (i in mods) {
            mods[i].start();
        }
    }
}

// Start the program
main();