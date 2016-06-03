/* server.js 
 * this is going to be the main entry point for the application
 * this will launch all of the processes and maanged the modules
*/

// Application entry point
function main(){
    var server = new Server();
    server.init();
}

var envs = require('envs');

// Includes
var modules = require('./util/modules.js');
var rest_server = require('./rest/rest_server.js');
var db = require('./database/database.js');
var resource_manager = require('./util/ext_resource_manager.js');
var data_manager = require('./data/data_manager.js');

function Server(){
    // Private vars
    var MODULE_NAME_IDX = 0;
    var MODULE_OBJECT_IDX = 1;
    
    // Public methods
    Server.prototype.init = function () {
        console.log('starting server');
        // System is the list of systems that are created and used by this server
        // They are in the format of [0]module name, [1]module object
        // I might want to move this so it is confined 
        moduleList = [
            ['rest_server', rest_server],
            ['db', db],
            ['resource_manager', resource_manager],
            ['data_manager', data_manager]
        ];
        
        createModules(moduleList);
        startModules();
    }
    
    // Private methods
    function createModules(moduleList) {
        for (i in moduleList) {
            var modName = moduleList[i][MODULE_NAME_IDX];
            var modObject = moduleList[i][MODULE_OBJECT_IDX];
            
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