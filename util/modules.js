
var modules = [];

module.exports = {
    
    addModule: function (id, object) {
        if (id in modules) {
            console.log("id: " + id + " in ServerSytems.systems array already exists");
            throw "err";
        }
        modules[id] = object;
    },
    
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