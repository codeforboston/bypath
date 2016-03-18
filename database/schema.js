/* schema.js
 * this module will produce the schema for wrting and reading the db
*/

module.exports = {
    generateSchema: function (data) {
        // Grab change the data's format to fit the db
        // in the form of <path>: <values>
        var output = [];
        output['/master'] = { 'id': data['id'] };
        output['/open'] = data['open'];
        output['type'] = data['type'];
        output['title'] = data['title'];
        output['location'] = data['loc'];
        output['/geo'] = data['geo'];

        return output;
    }
}