var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/quiz/:id', function() {
	var qd;

    before(function(done) {
        server = app.listen(app.get('port'), function() {
            models.sequelize.sync({ force: true }).then(function () {
                utils.insertQuizDescriptor(models, 'Example Quiz Descriptor Title').then(function(res) {
                    qd = res;
                    done();
                });
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('/quiz/:id', function() {

        describe('when quiz id does not exist', function() {
        	before(function(done) {
        		browser.get('/quiz/'+qd.id+1);
        		done();
        	});
	        it('should successfuly get the given url, but the page should render the 404 template', function(done) {
	        	expect(browser.getCurrentUrl()).to.eventually.include('/quiz/'+qd.id+1);
	        	browser.findElement(by.id('fourOFour')).then(function() {
	        		done();
	        	});
	        });
        });

        describe('quiz title', function() {
        	before(function(done) {
        		browser.get('/quiz/'+qd.id);
        		done();
        	});
	        it('should display the quiz title on the page', function() {
	            expect(element(by.binding('quizStarter.qd.title')).getText()).to.eventually.equal(qd.title);
	        });
        });

        describe('Start Quiz', function() {

            beforeEach(function(done) {
                browser.get('/quiz/'+qd.id);
                done();
            });

            it('should go to /quiz/:id/:seed when the user clicks the Start Quiz button', function() {
                element(by.buttonText('Start Quiz')).click();
                expect(browser.getCurrentUrl()).to.eventually.include(browser.baseUrl + '/quiz/' + qd.id + '/');
            });

            it('should go to /quiz/:id/:seed with seed corresponding to the valid seed input', function() {
                element(by.model('quizStarter.seed')).sendKeys('abcd4444');
                element(by.buttonText('Start Quiz')).click();
                expect(browser.getCurrentUrl()).to.eventually.include(browser.baseUrl + '/quiz/' + qd.id + '/abcd4444');
            });
            
        });

    });

});