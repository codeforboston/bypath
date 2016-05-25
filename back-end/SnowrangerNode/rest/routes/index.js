/* index.js
 * this constains the controls for the first pages
*/

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	console.log("hi there");
	res.send("Keep them comming");
});

module.exports = router;