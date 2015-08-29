var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/quizdescriptor/:id/settings/general', function() {
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



    describe('when user is unauthenticated', function() {
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
            it('should redirect the user to the login page', function(done) {
                browser.get('/quizdescriptor/'+(qd.id+1)+'/settings/questions');
                expect(browser.getCurrentUrl()).to.eventually.include('/login');
                done();
            });
        });
        describe('when the quiz id does exist', function() {
            it('should redirect the user to the login page', function(done) {
                browser.get('/quizdescriptor/'+(qd.id)+'/settings/questions');
                expect(browser.getCurrentUrl()).to.eventually.include('/login');
                done();
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
                        testUser.createQuizDescriptor( { descriptor: utils.getSampleQuizDescriptor("Test User's QD") } ).then(function(res2) {
                            myQD = res2;
                            done();
                        });
                    });
                });
            });
        });

        describe('when the does not belong to the authenticated user', function() {
            before(function(done) {
                browser.get('/quizdescriptor/'+notMyQD.id+'/settings/questions');
                done();
            });
            it('should render the 404 page', function(done) {
                expect(browser.getCurrentUrl()).to.eventually.include('/quizdescriptor/'+notMyQD.id+'/settings/questions');
                browser.findElement(by.id('fourOFour')).then(function() {
                    done();
                });
            });
        });
        describe('when the quiz belongs to the authenticated user', function() {
            before(function(done) {
                browser.get('/quizdescriptor/'+myQD.id+'/settings/questions');
                done();
            });
            it('should successfully navigate to /quizdescriptor/:id/settings/general', function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/quizdescriptor/'+myQD.id+'/settings/questions');
            });
        });
    });
});