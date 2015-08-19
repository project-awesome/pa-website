var projectAwesome = require("project-awesome");

function isValidId(n) {
    return /^\d+$/.test(n);
}

module.exports = function(app) {

    app.get('/api/question/moodle/:questionType/:seed', function(req, res) {
        if (!projectAwesome.isValidQuestionType(req.params.questionType)) {
            res.status(404).end();
            return;
        }
        if (!projectAwesome.isSeedValid(req.params.seed)) {
            res.status(404).end();
            return;
        }
        var count = 20;
        if (req.query.count) {
            count = parseInt(req.query.count);
            if (isNaN(count) || count < 1 || count > 999) {
                res.status(400).end();
                return;
            }
        }
        res.set('Content-Type', 'text/xml');
        try {
            res.send(projectAwesome.generateMoodleXML(req.params.questionType, count, req.params.questionType, req.params.seed));
        } catch (e) {
            res.status(400).end();
        }
        
        
    });

}




