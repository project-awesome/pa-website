var models = require('../../models');
var request = require('request');

function isValidId(n){
    return /^\d+$/.test(n);
}
    
module.exports = function(app) {
    
    app.post('/api/qd', function(req, res) {
        if (!req.isAuthenticated()) {
            res.status(403).end();
            return;
        }

        if (typeof req.body !== 'object') {
            console.log("req.body is not an object.");
            res.status(400).end();
            return;
        }

        if (!req.body.descriptor) {
            res.status(400).end();
            return;
        }
        request.post(
            'https://pa-service-prod.herokuapp.com/v1/validate_quiz_descriptor',
            { json: { descriptor: req.body.descriptor } },
            function (paError, paResponse, syntaxErrors) {
                if (paError || paResponse.statusCode != 200) {
                    res.status(503).end();
                    return;
                }
                var params = {};
                if (syntaxErrors.length > 0) {
                    res.status(400).end();
                    return;
                } else {
                    params.descriptor = req.body.descriptor;
                }

                if ('title' in req.body) {
                    if (typeof req.body.title !== 'string') {
                        res.status(400).end();
                        return;
                    } else {
                        params.title = req.body.title;
                    }
                }

                models.User.findOne({ where: {awesome_id: req.user.awesome_id} }).then(function(user) {
                    if (user) {
                        user.createQuizDescriptor(params).then(function(qd) {
                            res.json(qd);
                        }).catch(function(error) {
                            res.status(500).end();
                        })
                    }
                });

            }
        );
        
        
    });

    
    app.put('/api/qd/:id', function(req, res) {
        if (!isValidId(req.params.id)) {
            console.log("Invalid quiz descriptor id.");
            res.status(400).end();
            return;
        }
        if (!req.isAuthenticated()) {
            res.status(403).end();
            return;
        }
        models.QuizDescriptor.findOne({ where: {id: req.params.id, UserAwesomeId : req.user.awesome_id } }).then(function(qd) {
            if (!qd) {
                res.status(403).end();
                return;
            }
            if (typeof req.body !== 'object') {
                console.log("req.body is not an object.");
                res.status(400).end();
                return;
            }
            var updateRequest = {};
            var emptyRequest = true;
            if ('hidden' in req.body) {
                if (req.body.hidden !== true && req.body.hidden !== false) {
                    console.log("Hidden must be a boolean.");
                    res.status(400).end();
                    return;
                }
                updateRequest.hidden = req.body.hidden;
                emptyRequest = false;
            }
            if ('published' in req.body) {
                if (req.body.published !== true && req.body.published !== false) {
                    console.log("Published must be a boolean.");
                    res.status(400).end();
                    return;
                }
                if (req.body.published === false && qd.published === true) {
                    console.log("Trying to unpublished a published quiz.");
                    res.status(400).end();
                    return;
                }
                updateRequest.published = req.body.published;
                emptyRequest = false;
            }

            if ('title' in req.body) {
                if (typeof req.body.title !== 'string') {
                    res.status(400).end();
                    return;
                } else {
                    updateRequest.title = req.body.title;
                }
                emptyRequest = false;
            }

            if ('descriptor' in req.body) {

                if (qd.published === true) {
                    console.log("Trying to edit a published quiz.");
                    res.status(400).end();
                    return;
                }


                request.post(
                    'https://pa-service-prod.herokuapp.com/v1/validate_quiz_descriptor',
                    { json: { descriptor: req.body.descriptor } },
                    function (paError, paResponse, syntaxErrors) {
                        if (paError || paResponse.statusCode != 200) {
                            res.status(503).end();
                            return;
                        }
                        if (syntaxErrors.length > 0) {
                            res.status(400).end();
                            return;
                        }
                        updateRequest.descriptor = req.body.descriptor;
                        qd.updateAttributes(updateRequest).then(function(updatedQD) {
                            res.json(updatedQD);
                        }).catch(function(error) {
                            res.status(500).end();
                        });
                    }
                );

            } else {
                if (emptyRequest) {
                    res.status(400).end();
                    return;
                }
                qd.updateAttributes(updateRequest).then(function(updatedQD) {
                    res.json(updatedQD);
                }).catch(function(error) {
                    res.status(500).end();
                });
            }



        });
    });
    

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

        models.QuizDescriptor.findAll({ where: filters }).then(function(qds) {
            if (!qds) {
                res.status(500).end();
            } else {
                res.json(qds);
            }
        });
        
    });

}

