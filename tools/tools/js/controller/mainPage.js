toolsApp.controller("mainPageCtrl", function ($scope, toolsFactory, $location) {
    var MODULE_NAME_IDX = 0;
    var MODULE_OBJECT_IDX = 1;
    
    var modules = require('./js/api/util/modules.js');

    function init(){
        if (!$scope.systemsInitialized) {
            var firebase = require('./js/api/database/db_firebase.js');
            var resource_manager = require('./js/api/util/ext_resource_manager.js');
            var data_manager = require('./js/api/data/data_manager.js');
            
            console.log(modules);
            console.log(resource_manager);
            
            
            console.log('starting server');
            // System is the list of systems that are created and used by this server
            // They are in the format of [0]module name, [1]module object
            // I might want to move this so it is confined 
            moduleList = [
                ['firebase', firebase],
                ['resource_manager', resource_manager],
                ['data_manager', data_manager]
            ];
            
            createModules(moduleList);
            startModules();

            $scope.systemsInitialized = true;
        }
    }
    
    function createModules(moduleList) {
        for (i in moduleList) {
            var modName = moduleList[i][MODULE_NAME_IDX];
            var modObject = moduleList[i][MODULE_OBJECT_IDX];
            
            // The order we initialize and add the object to the modules list 
            // shouldn't matter since module::init() should not ref other modules
            modules.addModule(modName, modObject);
            
            modObject.init();
        }

        console.log('Modules initialized');
    }
    
    function startModules() {
        // I might want to move this to the modules module
        var mods = modules.getModules();
        
        // Iter though the modules and tell them to start
        for (i in mods) {
            mods[i].start();
        }

        console.log('Modules started');
    }

    function start(){
        // List of tools available
        $scope.tools = [
            {
                'name': 'Home',
                'url': ''
            },
            {
                'name': 'Database Refresh',
                'url': 'dbRefresh'
            },
            {
                'name': 'Add New Data Source',
                'url': 'addNewSource'
            }
        ];
        
        $scope.header = "views/header.html";
    }

    init();
    start();
});