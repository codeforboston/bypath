'use strict';

angular.module('main')

.factory('TileSets', ['Config', function(Config) {

	function getTileSet(tileset) {
		switch (tileset) {
			case "Streets Basic":
			default:
				return {
			        name: "Streets Basic",
			        url: Config.ENV.MAPBOX_API,
			        type: "xyz",
			        options: {
			            mapid: "mapbox.streets-basic",
			            format: "png",
			            apikey: "pk.eyJ1IjoiYWVsYXdzb24iLCJhIjoiY2luMnBtdGMxMGJta3Y5a2tqd29sZWlzayJ9.wxiPp_RFGYXGB2SzXZvfaA"
			        }
		        };
		}
	};

	return {
		getTileSet: getTileSet
	};
}]);