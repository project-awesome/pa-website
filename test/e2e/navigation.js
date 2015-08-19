var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../app.js');
var models = require('../../models');
var utils = require('../utils');
var server;

describe('Navigation Bar', function() {

    before(function(done) {
        models.sequelize.sync({ force: true }).then(function () {
            server = app.listen(app.get('port'), function() {
                done();
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('Navigation Dropdown Menu', function () {

        before(function(done) {
            browser.get('/');
            done();
        });

        beforeEach(function(done) {
            browser.findElement(by.id('navigation-dropdown')).click().then(function() {
                done();
            });
        });

        it('should navigate to /student', function(done) {
            element(by.id('navigation-links')).element(by.cssContainingText('a','Student')).click();
            expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/student');
            done();
        });

        it('should navigate to /instructor', function(done) {
            element(by.id('navigation-links')).element(by.cssContainingText('a','Instructor')).click();
            expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/instructor');
            done();
        });
        
        it('should navigate to /author', function(done) {
            element(by.id('navigation-links')).element(by.cssContainingText('a','Author')).click();
            expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/author');
            done();
        });
        
        it('should navigate to /developer', function(done) {
            element(by.id('navigation-links')).element(by.cssContainingText('a','Developer')).click();
            expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/developer');
            done();
        });

    });

    describe('Home Button', function() {

        it('should take us home when home is clicked', function(done) {
            browser.get('/student');
            browser.findElement(by.id('home-button')).click();
            expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/');
            done();
        });
    });
    
    describe('User Dropdown Menu', function () {
        var testUser;
        beforeEach(function(done) {
            utils.protractorLogin().then(function(user) {
                testUser = user;
                done();
            });
        });

        afterEach(function(done) {
            utils.protractorLogout().then(function() {
                done();
            });
        });

        describe('Settings Dropdown', function() {
            it('should navigate to the /usersettings page', function(done) {
                element(by.id('user-links')).element(by.cssContainingText('a','Settings')).click();
                expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/usersettings');
                done();
            });

            it('should log out using the user dropdown', function(done) {
                browser.ignoreSynchronization = true;
                element(by.id('user-links')).element(by.cssContainingText('a','Sign Out')).click();
                expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/');
                browser.ignoreSynchronization = false;
                done();
            });

        });
        

    });

});

















