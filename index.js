var app = require('./app.js');
var models = require("./models");

var resetDatabase = false;
if (process.env.NODE_ENV != 'production')
	resetDatabase = true;

models.sequelize.sync({ force: resetDatabase }).then(function () {
	if (process.env.NODE_ENV != 'production')
		require("./fixtures").loadAllFixtures(models);
	var server = app.listen(app.get('port'), function() {
		console.log('Node app is running on port', server.address().port);
	});
});
