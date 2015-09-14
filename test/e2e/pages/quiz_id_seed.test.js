var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/quiz/:id/:seed', function() {
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

    describe('when quiz seed is not an 8 digit hex', function() {
    	var seed = '1234abch';
    	before(function(done) {
    		browser.get('/quiz/'+qd.id+'/'+ seed);
    		done();
    	});
        it('should successfuly get the given url, but the page should render the 404 template', function() {
        	expect(browser.getCurrentUrl()).to.eventually.include('/quiz/'+qd.id+'/'+ seed);
        	element(by.id('fourOFour'));
        });
    });

    describe('quiz title, seed, and id in the html', function() {
    	var seed = '1234abcd';
    	before(function(done) {
			browser.get('/quiz/'+qd.id+'/'+ seed + '?q=1&k=1').then(done);
    	});
        it('should display the quiz title on the page', function() {
            expect(element(by.binding('quizCtrl.title')).getText()).to.eventually.equal(qd.title);
        });
        it('should display the same seed on the page and in the url', function() {
            expect(element(by.id('quiz-seed')).getText()).to.eventually.equal(seed);
            expect(browser.getCurrentUrl()).to.eventually.include('/'+qd.id+'/'+seed);
        });
        it('should display the same quiz id on the page and in the url', function() {
            expect(element(by.id('quiz-id')).getText()).to.eventually.equal(qd.id+'');
            expect(browser.getCurrentUrl()).to.eventually.include('/'+qd.id+'/'+seed);
        });
    });
                    

    describe('when quiz id does not exist', function() {
    	var seed = '1234abcd';
    	before(function(done) {
    		browser.get('/quiz/'+qd.id+1+'/'+ seed);
    		done();
    	});
        it('should successfuly get the given url, but the page should render the 404 template', function(done) {
        	expect(browser.getCurrentUrl()).to.eventually.include('/quiz/'+qd.id+1+'/'+ seed);
        	browser.findElement(by.id('fourOFour'));
        	done();
        });
    });
});






