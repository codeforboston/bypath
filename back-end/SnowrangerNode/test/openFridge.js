// This is just a test module to make sure that stockTheFridge is keeping things ice cold.

var fridge = require('./data/stockTheFridge.js');
var fs = require('fs-extra-promise');

exports.topShelf = function() {
	fridge.topShelf('new_york_city_311', function(r) {
		fs.writeFileAsync('./top-shelf-example-nyc311.json', JSON.stringify(r));
	});
}

// TODO: not really a test...
// exports.fridge = fridge.fridayNight();