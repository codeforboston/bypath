/* modules.js
 * this manages the modules for the system
*/
var modules = [];

module.exports = {
    
    addModule: function (id, object) {
        // Throw an error if the id has alread beed added
        if (id in modules) {
            console.log("id: " + id + " in ServerSytems.systems array already exists");
            throw "err";
        }
        modules[id] = object;
    },
    
    // Need a better way to access the modules
    // I only want read access to modules not write
    getModules: function () {
        return modules;
    },
    
    getModule: function (id) {
        if (id in modules) {
            return modules[id];
        }
        return null;
    }
}