var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/instructor/allquizdescriptors', function() {
	var testUser;
    before(function(done) {
        server = app.listen(app.get('port'), function() {
            utils.resetEnvironment(app).then(function() {
                done();
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('quiz descriptor list', function() {
        var qdCount;
        before(function(done) {
            models.QuizDescriptor.create({ descriptor: utils.getSampleQuizDescriptor("Some Random QD") } ).then(function() {
            	models.QuizDescriptor.count().then(function(count) {
            		qdCount = count;
	                browser.get('/instructor/allquizdescriptors').then(function() {
	                    done();
	                });
            	});
            });
        });

        it('should contain all the quiz descriptors', function(done) {
            expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(qdCount);
            done();
        });

    });
});


