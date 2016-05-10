/**
 * Should return a nice SoQL query string for to use in your SalesForce SQL queries.
 * Note: will not handle any other SODA specific input queryables like $limit, $order...
 * Also currently it assumes that the base url will supply the `$where=` prefix. 
 * 
 * @param  {Object} options  Dr. Pepper AND Sprite?? Ew.
 * @return {String}         Put'r into the url. 
 * ie var query = "SELECT * WHERE open_dt > '$date' AND CASE_STATUS = 'Open' AND (STARTS_WITH(case_title, 'Unsafe/Dangerous Conditions') OR STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Request for Snow Plowing') OR STARTS_WITH(case_title, 'Park Maintenance'))";
 */
// :
// {
// 	@param {String} match_attr  ie 'type', 'case_title'...
// 	@param {Array.<String>} matching_array  ie ['Rodents', 'Snow Plowing']
// 	@param [optional] {String} open_dt  in whatever weird iso format thingey
// 	@param [optional] {String} case_status   ie 'Open' or 'Closed' or null
// }
exports.buildMeAQuery = function(options) {
// function query(options) {

	var match_attr = options['matchAttr']; 
	var matching_array = options['matchingArray']; 
	var open_dt = options['openDt'];
	var case_status = ['caseStatus'];

	// Safety belts.
	// 
	// TODO: find out why this array is actually an object.
	if (typeof matching_array !== 'object') return console.log('getMeASoda.query params requires an array for matching, got ' + typeof matching_array + ', it was: ' + matching_array);
	if (typeof match_attr !== 'string') return console.log('getMeASoda.query params requires a string for what to match to')

	
	//  Make a big string.
	//
		
	var s = 'SELECT * WHERE ';

	// Optionally add starting date and case status. 
	if (open_dt) s += "open_dt > '" + open_dt + "' AND "
	if (case_status) s += "CASE_STATUS = '" + case_status + "' AND ";

	// Matching attrs is not optional.
	s += '(';

	// For all strings in matching_array matching match_attr. 
	for (var i = 0; i < matching_array.length; i++) {
		s += 'STARTS_WITH(' + match_attr + ", '" + matching_array[i] + "')"
		if (i < matching_array.length - 1) s += ' OR ';
	}

	s += ')';

	return s;
};


// Test it. 
// 
// var util = require('util'); // .inspect
// var justPlainCoke = require('./justPlainCoke.js');
// console.log(query(justPlainCoke));
// => SELECT * WHERE CASE_STATUS = 'Open' AND open_dt > '$date' AND (STARTS_WITH(case_title, 'Unsafe/Dangerous Conditions') OR STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Request for Snow Plowing') OR STARTS_WITH(case_title, 'Park Maintenance'))

