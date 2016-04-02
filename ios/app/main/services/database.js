'use strict';
angular.module('main')
.factory('Database', function ($log, $http, $httpParamSerializer, $q, $rootScope, complainables, Utils, Geo, Ref, $firebaseArray) {

    // Tables will be in the format of a list of string
    // each string will be the name of a table you want
    // Master is the array with the keys to the other arrays

    function getObject(tables, callback){
        $log.log('tables -> ', tables);
        var refs = [];
        var allPromises = [];

        var master = $firebaseArray(Ref.child('master'));
        var defer = $q.defer();

        master.$loaded().then(function(){
            defer.resolve();
        });
        // push master into allPromises
        allPromises.push(defer.promise);

        for(var i in tables){
          var table = tables[i];
          $log.log('table', table);

          var r = {
            'name': table,
            'object': $firebaseArray(Ref.child(table))
          };
          $log.log('r', r);

          r['object'].$loaded().then(function arrayLoaded(data) {
            $log.log('r["object"].$loaded()', data);
            refs.push(r);
            $log.log('refs', refs);
            defer.resolve(r);
          });
          // push promise for each table into allPromises[]
          allPromises.push(defer.promise);
        }

        // $log.log('allPromises', allPromises);

        $q.all(allPromises)
            .then(function(allPromisesData){

              $log.log('allPromises resolved.');
              $log.log('allPromisesData -> ', allPromisesData);
              $log.log('refs[] ->', refs);
                // refs[] Array(5) <one for each prop> -> [{name: 'type', object: [{$value: "Tree in Park", $id: "-KCSxk6n0DImMtOLx88K", $priority: null}, {$value: "Reques...}]}]
                var output = [];

                // for each master id, ie each complaint
                angular.forEach(master, function(value){
                    //\\ $log.log('promises loaded. angular.forEach(master).value ->', value);
                    // value --> {case_id: "101001732366", $id: "-KCSyV95JeFpem1mfDD-", $priority: null}
                    var id = value.$id;
                    var object = {
                      'id': id
                      // load data here
                    };

                    // Add each item from the tables quered to the output object, ie assign properities
                    for (var i in refs) {
                        // name of property like 'type', 'status', 'geo'
                        var name = refs[i]['name'];
                        //\\ $log.log('name', name);
                        // dis bad boy
                        // $log.log('refs[i]', refs[i]); // ie {name: "type", object: []}
                        // $log.log('refs[i]["object"]', refs[i]['object']);
                        var o = refs[i]['object'].$getRecord(id);
                        // var m = refs[i]['object'].$getRecord(id);

                        // this should be null because null
                        // $log.log('o', o); // yep, it's null
                        // $log.log('m', m);

                        // To keep the object's format the same as the
                        // tables passed in I will set the value if it
                        // exists otherwise I set it to null
                        if (o) {
                            object[name] = o.$value;
                        }
                        else {
                            object[name] = 'asdf'; // null
                        }
                    }

                    output.push(object);
                })

                //console.log(output);

                callback(output);
            });
    };

    // Get full object with all available properties.
    // Properties are made available through back-end/SnowrangerNode/database/db_firebase.js#generateSchema()
    function getObjectAll(callback){
        var master = $firebaseArray(Ref.child('master'));
        var type = $firebaseArray(Ref.child('type'));
        var title = $firebaseArray(Ref.child('title'));
        var open = $firebaseArray(Ref.child('open'));
        var status = $firebaseArray(Ref.child('status'));
        var geo = $firebaseArray(Ref.child('geo'));

        getObject(['type','title','open','status', 'geo'], callback);
    };

    function getItem(path, callback){
        // Get from master, type, title,
        var item = $firebaseArray(Ref.child(path));

        item.$loaded().then(function (data){
          callback(data);
        });
    };

    // All updates and adds will not be sent to the firebase
    // but rather our server to process the request
    // Values are an array of json objects that are in the format of
    // {'path': path, 'value': value}
    function update(id, values){
        var url = 'http://codenamesnowranger.herokuapp.com/incident/update';
        var data = {'id': id, 'values': values};

        post(url, data);
    };

    function add(path, item){
    };

    function addNewItem(item){

        var url = 'http://codenamesnowranger.herokuapp.com/incident/addNew';
        var data = item;

        post(url, data);
    };

    function post(url, data){
        var config = {'Content-Type': 'application/x-www-form-urlencoded'};

        $http({
            method: 'POST',
            url: url,
            data: $httpParamSerializer(data),
            headers: config
        });
    };

    return {

        getObject: getObject,
        getObjectAll: getObjectAll,
        getItem: getItem,
        addNewItem: addNewItem,
        update: update,
    };

});
