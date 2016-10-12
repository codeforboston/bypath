'use strict';

angular.module('main')

.factory('Database', function ($log, $http, $httpParamSerializer, $q, Config, Utils) {

    // Tables will be in the format of a list of string
    // each string will be the name of a table you want
    // Master is the array with the keys to the other arrays

    /**
     * @param {String} table Table name.
     * @return {Promise:Array} Resolved firebase array.
     *
     * nb. Whatever the name of table is is what the property will be on the object.
     * also nb. 1 node deep.
     */
    function getTable(table) {
      var defer = $q.defer();
      $firebaseArray(Ref.child(table)).$loaded().then(function(tableData) {
        defer.resolve({name: table, data: tableData});
      });
      return defer.promise;
    };

    /**
     * @param {Array.<array>} resolvedTables Promise-resolved tables including master.
     * @return {Array} output Assembed objects based on master list ids.
     *
     * Matches ids from Master index with corresponding data in resolvedTables to assemble a list of
     * objects.
     */
    function assembleObjects(resolvedTables) { // master should be resolvedTables[0]

      var output = []; // array of assembled objects

      // for all master dictionary ids
      angular.forEach(resolvedTables[0]['data'], function(value) {
        var fbId = value.$id;

        var obj = {
          id: fbId
        };

        // for all resolved tables except master
        for (var i = 1; i < resolvedTables.length; i++) {
          var tableName = resolvedTables[i]['name'];

          // try to get data from each table
          var data = resolvedTables[i]['data'].$getRecord(fbId);

          if (data) {
            obj[tableName] = data.$value;
          } else {
            obj[tableName] = null;
          }
        }

        this.push(obj); // push obj to output[]
      }, output); // (output == this)

      return output;
    };

    /**
     * @param  {Array.<string>} tables Where table names::available properties on objects.
     * @return {promised Array.<object>} resolvedTables Where array.<object> contains promise-resolved data for all specified tables.
     *
     * Since this returns standalone property lists indexed by id, in order to make useful objects we have to #assembleObjects.
     */
    function getObject(tables){
        var resolvedTables = [];
        // get master -> [0]
        resolvedTables.push(getTable('master'));
        // get the rest
        for (var i in tables) {
          resolvedTables.push(getTable(tables[i]));
        }
        return $q.all(resolvedTables);
    };

    // Quick and dirty little alias method for Database.getObject(<all the properties array>);
    // Get full object with all available properties.
    // Properties are made available through back-end/SnowrangerNode/database/db_firebase.js#generateSchema()
    function getObjectAll(){
        return getObject([
            'type',
            'title',
            'open',
            'status',
            'geo',
            'location'
        ]);
    };

    function getItem(path, callback){
        // Get from master, type, title,
        var item = $firebaseArray(Ref.child(path));
        item.$loaded().then(function (data){
          callback(data);
        });
    };

    function getIssues(latitude, longitude, dist, callback) {
        var url = Config.ENV.BYPATH_API + '/incident/get?x=' + latitude + '&y=' + longitude + '&d=' + dist;
        get(url, callback);
    };

    function getParking(latitude, longitude, dist, callback) {
        var url = Config.ENV.BYPATH_API + '/parking/get?x=' + latitude + '&y=' + longitude + '&d=' + dist;
        get(url, callback);
    }

    // All updates and adds will not be sent to the firebase
    // but rather our server to process the request
    // Values are an array of json objects that are in the format of
    // {'path': path, 'value': value}
    function update(id, values) {
        var url = Config.ENV.BYPATH_API + '/incident/update';
        var data = {'id': id, 'values': values};
        post(url, data);
    };

    function add(path, item){
    };

    function addNewItem(item) {
        var url = Config.ENV.BYPATH_API + '/incident/addNew';
        var data = item;
        post(url, data);
    };

    function post(url, data) {
        var config = {
            'Content-Type' : 'application/x-www-form-urlencoded'
        };
        $http({
            method: 'POST',
            url: url,
            data: $httpParamSerializer(data),
            headers: config
        });
    };

    function get(url, callback) {
        $http({
            method: 'GET',
            url: url
        }).then(function success(response) {
            callback(response.data);
        }, function error(response){
            $log.log(response);
        });
    }

    return {
        getObject: getObject,
        getObjectAll: getObjectAll,
        getItem: getItem,
        getIssues: getIssues,
        getParking: getParking,
        addNewItem: addNewItem,
        update: update,
        assembleObjects: assembleObjects
    };
});
