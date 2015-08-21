var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/showpage/:id', function() {
	var qd;

    before(function(done) {
        models.sequelize.sync({ force: true }).then(function () {
            server = app.listen(app.get('port'), function() {
	            models.sequelize.sync({ force: true }).then(function () {
	                utils.insertQuizDescriptor(models, 'Example Quiz Descriptor Title').then(function(res) {
	                    qd = res;
	                    done();
	                });
	            });
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('/showpage/:id', function() {

        describe('when quiz id does not exist', function() {
        	before(function(done) {
        		browser.get('/showpage/'+qd.id+1);
        		done();
        	});
	        it('should successfuly get the given url, but the page should render the 404 template', function(done) {
	        	expect(browser.getCurrentUrl()).to.eventually.include('/showpage/'+qd.id+1);
	        	browser.findElement(by.id('fourOFour')).then(function() {
	        		done();
	        	});
	        });
        });

        describe('quiz descriptor', function() {
        	before(function(done) {
        		browser.get('/showpage/'+qd.id);
        		done();
        	});
            it('should navigation to the url', function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/showpage/' + qd.id);
            });
            it('should display the quiz descriptor', function() {
                expect(element(by.id('qd-title')).getText()).to.eventually.equal(qd.descriptor.title);
            });
        });

    });

});