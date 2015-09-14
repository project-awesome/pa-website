var models = require('../../models');
var projectAwesome = require("project-awesome");

function isValidId(n) {
	return /^\d+$/.test(n);
}

module.exports = function(app) {

    app.get('/api/quiz/:id/:seed', function(req, res) {
        if (!isValidId(req.params.id)) {
            res.status(400).end();
            return;
        }

    	if (!projectAwesome.isSeedValid(req.params.seed)) {
    		res.status(404).end();
    		return;
    	}

        models.QuizDescriptor.findOne({ where: {id: req.params.id} }).then(function(qd) {
            if (!qd) {
                res.status(404).end();
            } else {
            	var quiz = projectAwesome.buildQuiz(qd.descriptor, qd.id, req.params.seed);
            	res.json({ quiz: quiz, title: qd.title });
            }
        });
        
    });

}











