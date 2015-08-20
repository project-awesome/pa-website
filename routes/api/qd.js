var models = require('../../models');
var projectAwesome = require("project-awesome");
module.exports = function(app) {
    
    app.post('/api/qd', function(req, res) {
        if (!req.isAuthenticated()) {
            res.status(403).end();
            return;
        } else if (!req.body.descriptor) {
            res.status(400).end();
            return;
        } else if (!projectAwesome.isValidQuizDescriptor(req.body.descriptor)) {
            res.status(400).end();
            return;
        }

        models.User.findOne({ where: {awesome_id: req.user.awesome_id} }).then(function(user) {
            if (user) {
                user.createQuizDescriptor({descriptor: req.body.descriptor}).then(function(qd) {
                    res.json(qd);
                }).catch(function(error) {
                    res.status(500).end();
                })
            }
        });
        
        
    });

    function isValidId(n){
        return /^\d+$/.test(n);
    }
    
    app.get('/api/qd/:id', function(req, res) {
        if (!isValidId(req.params.id)) {
            res.status(400).end();
            return;
        }


        models.QuizDescriptor.findOne({ where: {id: req.params.id} }).then(function(qd) {
            if (!qd) {
                res.status(404).end();
            } else {
                res.json(qd);
            }
        });
        
    });

    app.get('/api/qd', function(req, res) {

        models.QuizDescriptor.findAll().then(function(qds) {
            if (!qds) {
                res.status(500).end();
            } else {
                res.json(qds);
            }
        });
        
    });

}

