var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/quizdescriptor/:id', function() {
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

    describe('general cases', function() {
        var qd;
        before(function(done) {
            utils.resetEnvironment(app).then(function() {
                utils.insertQuizDescriptor(models, 'Example Quiz Descriptor Title').then(function(res) {
                    qd = res;
                    done();
                });
            });
        });
        describe('when the quiz id does not exist', function() {
            before(function(done) {
                browser.get('/quizdescriptor/'+qd.id+1);
                done();
            });
            it('should successfuly get the given url, but the page should render the 404 template', function(done) {
                expect(browser.getCurrentUrl()).to.eventually.include('/quizdescriptor/'+qd.id+1);
                browser.findElement(by.id('fourOFour')).then(function() {
                    done();
                });
            });
        });
        describe('when quiz id does exist', function() {
            before(function(done) {
                browser.get('/quizdescriptor/'+qd.id);
                done();
            });
            it('should navigation to the url', function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/quizdescriptor/' + qd.id);
            });
            it('should display the quiz descriptor', function() {
                expect(element(by.id('qd-title')).getText()).to.eventually.equal(qd.title);
            });
        });
    });

    describe('when user is authenticated', function() {
        var notMyQD, myQD, testUser;
        before(function(done) {
            utils.resetEnvironment(app).then(function() {
                utils.insertQuizDescriptor(models, 'Example Quiz Descriptor Title').then(function(res1) {
                    notMyQD = res1;
                    utils.authenticateTestUser().then(function(user) {
                        testUser = user;
                        testUser.createQuizDescriptor( { descriptor: utils.getSampleQuizDescriptor() } ).then(function(res2) {
                            myQD = res2;
                            done();
                        });
                    });
                });
            });
        });
        describe('when user owns the given qd', function() {
            before(function(done) {
                browser.get('/quizdescriptor/'+myQD.id);
                done();
            });
            describe('settings button', function() {
                var settingsButton;
                before(function() {
                    settingsButton = element(by.id('qd-settings'));
                });
                it('should be present', function(done) {
                    settingsButton.isDisplayed().then(function(p) {
                        expect(p).to.be.true;
                        done();
                    });
                });
                it('should take us to /quizdescriptor/:id/settings when clicked', function(done) {
                    settingsButton.click().then(function() {
                        expect(browser.getCurrentUrl()).to.eventually.include('/quizdescriptor/'+myQD.id+'/settings');
                        done();
                    });
                });
            });
        });
        describe('when user does not own the given qd', function() {
            before(function(done) {
                browser.get('/quizdescriptor/'+notMyQD.id);
                done();
            });
            describe('settings button', function() {
                it('should not be present', function() {
                    expect(element(by.id('qd-settings')).isDisplayed()).to.eventually.be.false;
                });
            });
        });
    });

});



