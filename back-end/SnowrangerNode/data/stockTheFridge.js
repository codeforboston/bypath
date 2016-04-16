var fs = require('fs-extra-promise'); // for writing and reading files
var util = require('util'); // for inspecting loggables
var request = require('sync-request');
var _ = require('underscore');

var key = '';
var cities = {};
var limiter = 20;

function getKey() {
	return fs.readFileAsync('./keys.txt', 'utf8');
}
function setKey(data) {
	key = data.split('=')[1];
}
function getCities() {
	return fs.readFileAsync('./endpoints.json', 'utf8');
}
function setCities(data) {
	cities = JSON.parse(data);
}
function getCitiesData() {
	var theRefrig = {};
	_.each(cities, function(val, key) {
		var daType = val['map']['type'];
		var method = 'GET';
		var daUrl = val['url'].replace('$query=','') + '$limit=' + limiter.toString() + '&$group=' + daType + '&$select=' + daType + ',count(' + daType + ')' + '&$order=' + 'count_' + daType + ' DESC';// + '&$order=';
		var daOpts = {
			'headers': {
	        'X-App-Token': 'zdkQROnSL8UlsDCjuiBcc3VHq' // key
	    }
	  };
		var res = request(method, daUrl, daOpts);
		console.log(res.getBody());
		theRefrig[key] = res.getBody('utf8');
	});
	fs.writeFileAsync('./refrig.json', JSON.stringify(theRefrig)).then(function() {
		console.log('saved top types as -> \n', util.inspect(theRefrig));
	});
}

function handleError(err) {
	console.log(util.inspect(err));
}

getKey()
.then(setKey)
.then(getCities)
.then(setCities)
.then(getCitiesData)
.catch(handleError);

