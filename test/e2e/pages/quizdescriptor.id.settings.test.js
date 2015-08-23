var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/quizdescriptor/:id/settings/* navigation', function() {
    var qd, testUser;
    before(function(done) {
        server = app.listen(app.get('port'), function() {
            utils.resetEnvironment(app).then(function() {
                utils.authenticateTestUser().then(function(user) {
                    testUser = user;
                    testUser.createQuizDescriptor( { descriptor: utils.getSampleQuizDescriptor("Test User's QD") } ).then(function(res) {
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

    describe('navigation menu', function() {
        before(function(done) {
            browser.get('/quizdescriptor/'+qd.id+'/settings/general');
            done();
        });

        it('should navigate the /questions page and the Questions nav item should be active', function(done) {
            var questionsLink = element(by.linkText('Questions'));
            questionsLink.click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/questions');
                expect(questionsLink.getAttribute('class')).to.eventually.include('active');
                done();
            });
        });

        it('should navigate the /publish page and the Publish nav item should be active', function(done) {
            var publishLink = element(by.linkText('Publish'));
            publishLink.click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/publish');
                expect(publishLink.getAttribute('class')).to.eventually.include('active');
                done();
            });
        });

        it('should navigate the /general page and the General nav item should be active', function(done) {
            var generalLink = element(by.linkText('General'));
            generalLink.click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/general');
                expect(generalLink.getAttribute('class')).to.eventually.include('active');
                done();
            });
        });
    });

});
