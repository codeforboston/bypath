'use strict';
angular.module('main')
.factory('Database', function ($log, $http, $httpParamSerializer, $q, $rootScope, complainables, Utils, Geo, Ref, $firebaseArray) {

    // Tables will be in the format of a list of string
    // each string will be the name of a table you want
    // Master is the array with the keys to the other arrays
    function getObject(tables, callback){
        var refs = [];
        // The only reason I keep this array is because I don't want these to fall out of scope
        // wait for the promises to happen on the async database calls
        var defs = [];
        var proms = [];

        var output = [];

        var master = $firebaseArray(Ref.child('master'));

        var re = {'name':'master', object: master};
        var de = $q.defer();

        master.$loaded().then(function(){
            de.resolve();
        });
        //refs.push(re);
        //defs.push(de);
        proms.push(de.promise);

        for(var i in tables){
            var table = tables[i];

            // I need to keep the name for later
            var r = {'name':table, object: $firebaseArray(Ref.child(table))};

            r['object'].$loaded().then(function(){
                de.resolve();
            });

            refs.push(r);
            //defs.push(d);
            proms.push(de.promise);
        }

        $q.all(proms)
            .then(function(){
                var output = [];

                angular.forEach(master, function(v){
                    var object = {};

                    var id = v.$id;
                    object['id'] = id;

                    // Add each item from the tables quered to the output object
                    for(var i in refs){
                        var name = refs[i]['name'];

                        // dis bad boy
                        var o = refs[i]['object'].$getRecord(id);

                        // To keep the object's format the same as the
                        // tables passed in I will set the value if it
                        // exists otherwise I set it to null
                        if (o){
                            object[name] = o.$value;
                        }
                        else{
                            object[name] = null;
                        }
                    }

                    output.push(object);
                })

                //console.log(output);

                callback(output);
            });
    };
    // Get full object
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

        var url = 'http://codenamesnowranger.herokuapp.com//incident/addNew';
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
