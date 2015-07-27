var app = require('./app.js');
var models = require("./models");

models.sequelize.sync({ force: true }).then(function () {
	if (process.env.NODE_ENV != 'production')
		require("./fixtures").loadFixtures(models);
	var server = app.listen(app.get('port'), function() {
		console.log('Node app is running on port', server.address().port);
	});
});

