var fs = require('fs-extra-promise'); // for writing and reading files
var util = require('util'); // for inspecting loggables
var request = require('sync-request'); // yea, n sync. yea, yea, yea. 
var _ = require('underscore');

/**
 * Our app-specific key for Socrata.
 * Is read from file. 
 * TODO: Get the one in the file to work for me. -ia
 * @type {String}
 */
var key = '';

/**
 * Will be an in-mem store filled via ./endpoints.json and through
 * which we'll get the data we need to request the Socrata SODA data.
 * @type {Object}
 */
var cities = {};

/**
 * How many top types do you want to limit to?
 * @type {Number}
 */
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

	// This'll, once it's filled up with n request responses, get written to ./refrig.json. 
	var theRefrig = {};

	// For each city by depth=1 key in ./endpoints.json. 
	_.each(cities, function(val, key) {
		
		// What the particular city calls its types.
		// ie, 'category', 'type', 'complaint_type'
		var daType = val['map']['type'];

		// Set up the request.
		var method = 'GET';
		var daUrl =  val['url'].replace('$query=','')
						  + '$limit=' + limiter.toString() 
						  + '&$group=' + daType 
						  + '&$select=' + daType + ',count(' + daType + ')' 
						  + '&$order=' + 'count_' + daType + ' DESC';

		var daOpts = {
			'headers': {
	        'X-App-Token': 'zdkQROnSL8UlsDCjuiBcc3VHq' // key <- keys.txt one was throwing a permission denied error
	    }
	  };

	  // Request here is deliberately syncronous, which saves a lot of hassle for 
	  // iterating the cities.
		var res = request(method, daUrl, daOpts);
		console.log(res.getBody());

		// UTF8 encoding will save you from a the fearsome buffer. 
		theRefrig[key] = res.getBody('utf8');
	});

	// Now that we have the scope var theRefrig all set thanks to some syncronous code, 
	// we're ready to write it to the file. Which will happen asyncronously but so what.
	fs.writeFileAsync('./refrig.json', JSON.stringify(theRefrig)).then(function() {
		console.log('saved top types as -> \n', util.inspect(theRefrig));
	});
}

function handleError(err) {
	console.log(util.inspect(err));
}

/**
 * To be run on a cron. 
 * Uses ./endpoints.json as a reference (and map) for cities available and gets the top <limiter>
 * number of case types. 
 * @return {void} Saves data to file './refrig.json'. 
 */
function fridayNight() {
	return getKey()
	.then(setKey)
	.then(getCities)
	.then(setCities)
	.then(getCitiesData)
	.catch(handleError);
}

/**
 * Gets array of top case types for a given endpoint. 
 * DOES NOT update the data. Just formats it nicely.
 * @param  {string} endPointKey as per endpoints.json
 * @return {array.<string>}   r ... which could be tossed into getMeASoda. 
 */
function topShelf(endPointKey, callback) {

	// Gotta get the city data in order that we'll need for referencing. 
	// Gotta luv dem promises.
	getCities()
	.then(setCities)
	.then(function() {
		fs.readFileAsync('./refrig.json', 'utf8').then(function(data) {

			// This will be the array of case types as read from ./refig.json for the given city. 
			var r = [];

			// Parse the data into an object.
			var data = JSON.parse(data);

			// Again, parse the data into an object for just the given city.
			var cityData = JSON.parse(data[endPointKey]); // (is an array)

			// Figure out what that city calls their 'types'.
			var typeName = cities[endPointKey]['map']['type'];

			// TODO: could use underscore
			// For each element in the cityData array, ie {\"complaint_type\":\"Noise - Street/Sidewalk\",\"count_complaint_type\":\"174111\"
			for (var i = 0; i < cityData.length; i++) { 
				
				// Picking just the type name for each element, (as opposed to the _count),
				// which is pushed to the returnable out r.
				r.push(cityData[i][typeName]); 
			}

			// console.log(util.inspect(r));
			return callback(r);
		});	
	})
	.catch(handleError);
}

module.exports = {
	fridayNight: fridayNight,
	topShelf: topShelf
};
