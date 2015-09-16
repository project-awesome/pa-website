var request = require('request');

function isValidId(n) {
    return /^\d+$/.test(n);
}

module.exports = function(app) {

    app.get('/api/question/moodle/:questionType/:seed', function(req, res) {

        var count = 20;
        if (req.query.count) {
            count = parseInt(req.query.count);
            if (isNaN(count) || count < 1 || count > 999) {
                res.status(400).end();
                return;
            }
        }

        var reqUrl = 'https://pa-service-prod.herokuapp.com/v1/generate_moodle_xml';
        reqUrl = reqUrl + '?question_type=' + req.params.questionType;
        reqUrl = reqUrl + '&question_name=' + req.params.questionType;
        reqUrl = reqUrl + '&count=' + count;
        reqUrl = reqUrl + '&seed=' + req.params.seed;

        request.get(
            reqUrl,
            function (paError, paResponse, body) {
                if (paError || paResponse.statusCode != 200) {
                    res.status(paResponse.statusCode).end();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(body);
            }
        );
        
        
    });

}




