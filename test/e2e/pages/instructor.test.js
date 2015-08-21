var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;

describe('/instructor', function() {
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

    describe('instructor navigation items', function() {
        before(function(done) {
            browser.get('/instructor').then(function() { done(); })
        });
        describe('Instructor', function() {
            var firstNavItem;
            before(function(done) {
                firstNavItem = element(by.repeater('tab in instructorCtrl.navigationTabs | filter:{loginRequired:false}').row(0));
                firstNavItem.click().then(function() {
                    done();
                });
            });
            it('should be the first navigation item', function() {
                expect(firstNavItem.getText()).to.eventually.equal('Instructor');
            });
            it('should have class active', function() {
                expect(firstNavItem.getAttribute('class')).to.eventually.include('active');
            });
        });
        describe('Export Questions', function() {
            var exportNavItem;
            before(function(done) {
                exportNavItem = element(by.linkText('Export Questions'));
                exportNavItem.click().then(function() {
                    done();
                });
            });
            it('should go to /instructor/export', function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/instructor/export');
            });
            it('should have class active', function() {
                expect(exportNavItem.getAttribute('class')).to.eventually.include('active');
            });
        });
        describe('All Quiz Descriptors', function() {
            var allQDsNavItem;
            before(function(done) {
                allQDsNavItem = element(by.linkText('All Quiz Descriptors'));
                allQDsNavItem.click().then(function() {
                    done();
                });
            });
            it('should go to /instructor/allquizdescriptors', function() {
                expect(browser.getCurrentUrl()).to.eventually.include('/instructor/allquizdescriptors');
            });
            it('should have class active', function() {
                expect(allQDsNavItem.getAttribute('class')).to.eventually.include('active');
            });
        });
        describe('My Quiz Descriptors', function() {
            describe("when the user is unauthenticated", function() {
                var qdNavItem, testUser;
                before(function(done) {
                    qdNavItem = element(by.linkText('My Quiz Descriptors'));
                    qdNavItem.click().then(function() {
                        done();
                    });
                });
                it('should redirect user to /login', function() {
                    expect(browser.getCurrentUrl()).to.eventually.include('/login');
                });
            });

            describe("when the user is authenticated", function() {
                var qdNavItem, testUser;
                before(function(done) {
                    utils.authenticateTestUser().then(function(user) {
                        testUser = user;
                        browser.get('/instructor').then(function() {
                            qdNavItem = element(by.linkText('My Quiz Descriptors'));
                            qdNavItem.click().then(function() {
                                done();
                            });
                        });
                    });
                });
                after(function() {
                    utils.unauthenticateTestUser();
                });
                it('should go to /instructor/myquizdescriptors', function() {
                    expect(browser.getCurrentUrl()).to.eventually.include('/instructor/myquizdescriptors');
                });
                it('should have class active', function() {
                    expect(qdNavItem.getAttribute('class')).to.eventually.include('active');
                });
            });
        });
    });
});


