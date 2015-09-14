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

    describe('Navigation Dropdown Menu', function () {
        var navDropDown;
        before(function(done) {
            browser.get('/').then(function() {
                navDropDown = element(by.id('navigation-dropdown'));
                done();
            });
        });
        beforeEach(function() {
            navDropDown.click();
        });

        it('should navigate to /student', function() {
            navDropDown.element(by.cssContainingText('a','Student')).click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/student');
            });
        });

        it('should navigate to /instructor', function() {
            navDropDown.element(by.cssContainingText('a','Instructor')).click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/instructor');
            });
        });
        
        it('should navigate to /author', function() {
            navDropDown.element(by.cssContainingText('a','Author')).click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/author');
            });
        });
        
        it('should navigate to /developer', function() {
            navDropDown.element(by.cssContainingText('a','Developer')).click().then(function() {
                expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/developer');
            });
        });

    });

    describe('Home Button', function() {

        before(function(done) {
            browser.get('/student');
            browser.findElement(by.id('home-button')).click();
            done();
        });

        it('should take us home when home is clicked', function() {
            expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/');
        });
    });
    
    describe('User Dropdown Menu', function () {
        var testUser;
        before(function(done) {
            utils.authenticateTestUser().then(function(user) {
                testUser = user;
                done();
            });
        });

        after(function() {
            utils.unauthenticateTestUser();
        });

        describe('Settings Dropdown', function() {

            before(function(done) {
                browser.get('/').then(function() {
                    done();
                });
            });

            beforeEach(function() {
                element(by.id('user-dropdown')).click();
            });

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

















