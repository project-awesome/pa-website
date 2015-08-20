var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../app.js');
var models = require('../../models');
var utils = require('../utils');
var server;



describe('Redirects', function() {
    before(function(done) {
        server = app.listen(app.get('port'), function() {
            utils.resetEnvironment(app).then(function() {
            	browser.get('/').then(function() {
                	done();
            	});
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });


	describe('/usersettings', function() {
		describe('unauthenticated user', function() {
			it('GET: should redirect the user to /login', function(done) {
				browser.get('/usersettings');
				expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/login');
				done();
			});
			it('navigate: should redirect the user to /login', function(done) {
				browser.get('/usersettings');
				expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/login');
				done();
			});
		});
		describe('authenticated user', function() {
	        var testUser;
	        before(function(done) {
	            utils.authenticateTestUser().then(function(user) {
	                testUser = user;
	                done();
	            });
	        });
	        after(function(done) {
	            utils.unauthenticateTestUser();
	            done();
	        });
	        
			it('should not redirect the user to /login', function(done) {
				browser.get('/usersettings');
				expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/usersettings');
				done();
			});
		});
	});

	describe('/login', function() {
		describe('unauthenticated user', function() {
			it('should not redirect the user', function(done) {
				browser.get('/login');
				expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/login');
				done();
			});
		});
		describe('authenticated user', function() {
	        var testUser;
	        before(function(done) {
	            utils.authenticateTestUser().then(function(user) {
	                testUser = user;
	                done();
	            });
	        });
	        after(function(done) {
	            utils.unauthenticateTestUser();
	            done();
	        });
			it('GET: should redirect the user to preferred page', function(done) {
				browser.get('/login');
				expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + '/' + testUser.role);
				done();
			});
		});
	});
});













