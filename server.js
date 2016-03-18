var express = require('express');

var index = require('./routes/index.js');
var incident = require('./routes/incident.js');

var app = express();

app.use('/', index);
app.use('/incident', incident);


var server = app.listen(8080, function () {
	console.log("starting server");
});