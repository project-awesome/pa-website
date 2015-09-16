var models = require('../../models');
var request = require("request");

function isValidId(n) {
	return /^\d+$/.test(n);
}

module.exports = function(app) {

    app.get('/api/quiz/:id/:seed', function(req, res) {
        if (!isValidId(req.params.id)) {
            res.status(400).end();
            return;
        }


        models.QuizDescriptor.findOne({ where: {id: req.params.id} }).then(function(qd) {
            if (!qd) {
                res.status(404).end();
            } else {
                request.post(
                    'https://pa-service-prod.herokuapp.com/v1/build_quiz',
                    { json: { seed: req.params.seed, descriptor: qd.descriptor } },
                    function (paError, paResponse, quiz) {
                        if (paError || paResponse.statusCode != 200) {
                            res.status(paResponse.statusCode).end();
                            return;
                        }
                        res.json({ quiz: quiz, title: qd.title });
                    }
                );
            	
            }
        });
        
    });

}











