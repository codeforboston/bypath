/* environment.js
 * this module will handle environemnt variable "injection".
*/

var path = require('path');
var envs = require('envs');
var fs = require('fs');

var DEFAULT_ENV = 'env-prod.json';
var CONSTANTS_PATH = path.dirname(require.main.filename) + '/constants/';

module.exports = {
    getEnvironment: function() {
        // Handle environment settings.
        if (envs('NODE_ENV') == 'DEV') {
            return JSON.parse(fs.readFileSync(CONSTANTS_PATH + 'env-dev.json', 'utf8'));
        }
        else if (envs('NODE_ENV') == 'PROD') {
            return JSON.parse(fs.readFileSync(CONSTANTS_PATH + 'env-prod.json', 'utf8'));
        }
        else {
            return JSON.parse(fs.readFileSync(CONSTANTS_PATH + DEFAULT_ENV, 'utf8'));
        }
    },
}
