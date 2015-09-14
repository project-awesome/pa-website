var models = require('../../models');
module.exports = function(app) {

    app.get('/api/user/:awesome_id/qd', function(req, res) {
        var filters = {};
        if (req.query.published) {
            if (req.query.published !== 'true' && req.query.published !== 'false') {
                res.status(400).end();
                return;
            }
            filters.published = req.query.published === 'true';
        }
        if (req.query.hidden) {
            if (req.query.hidden !== 'true' && req.query.hidden !== 'false') {
                res.status(400).end();
                return;
            }
            filters.hidden = req.query.hidden === 'true';
        }

        models.User.findOne({ where: {awesome_id: req.params.awesome_id} }).then(function(user) {
            if (!user) {
                res.status(404).end();
                return;
            }

            user.getQuizDescriptors({ where: filters }).then(function(qds) {
                if (!qds) {
                    res.status(500).end();
                } else {
                    res.json(qds);
                }
            });

        });
        
    });

}
