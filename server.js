/* server.js 
 * this is going to be the main entry point for the application
 * this will launch all of the processes and maanged the modules
*/

// Includes
var modules = require('./util/modules.js');

var rest_server = require('./rest/rest_server.js');
var firebase = require('./database/db_firebase.js');
var key_manager = require('./auth/keymanager.js');

function Server(){
    var MODULE_NAME_IDX = 0;
    var MODULE_OBJECT_IDX = 1;
    
    Server.prototype.init = function () {
        // System is the list of systems that are created and used by this server
        // They are in the format of [0]module name, [1]module object
        // I might want to move this so it is confined 
        systemList = [
            ['rest_server', rest_server],
            ['firebase', firebase],
            ['key_manager', key_manager]
        ];
        
        createSystems(systemList);
        startModules();
    }

    function createSystems(systemList) {
        for (i in systemList) {
            var modName = systemList[i][MODULE_NAME_IDX];
            var modObject = systemList[i][MODULE_OBJECT_IDX];
            
            modules.addModule(modName, modObject);
            
            modObject.init();
        }
    }

    function startModules(){
        var mods = modules.getModules();

        for (i in mods) {
            mods[i].start();
        }
    }
}

var server = new Server();
server.init();