var models = require('../../models');
var projectAwesome = require("project-awesome");
module.exports = function(app) {

    app.get('/api/user/:awesome_id/qd', function(req, res) {

        models.User.findOne({where: {awesome_id: req.params.awesome_id}})

        models.User.findOne({ where: {awesome_id: req.params.awesome_id} }).then(function(user) {
            if (!user) {
                res.status(404).end();
                return;
            }

            user.getQuizDescriptors().then(function(qds) {
                if (!qds) {
                    res.status(500).end();
                } else {
                    res.json(qds);
                }
            });

        });
        
    });

}
