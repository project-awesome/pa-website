var models = require('../../models');
module.exports = function(app) {
    
    app.put('/api/user/:awesome_id', function(req, res) {
        if (!req.isAuthenticated() || req.user.awesome_id != req.params.awesome_id) {
            res.status(403).end();
            return;
        } else if (!req.body.role || (req.body.role != 'student' && req.body.role != 'instructor' && req.body.role != 'author' && req.body.role != 'developer')) {
            res.status(400).end();
            return;
        }

        
        models.User.findOne({ where: {awesome_id: req.params.awesome_id} }).then(function(user) {
            if (user) { // if the record exists in the db
                user.updateAttributes({
                    role: req.body.role
                }).then(function(updatedUser) {
                    res.json(updatedUser);
                }).catch(function(error) {
                    res.status(500).end();
                })
            }
        });
        
    });

}








