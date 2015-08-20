var app = require('../../app.js');
var models = require('../../models');
var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../utils");

describe('Authentication routes', function() {
    describe('/logout', function() {
        describe('when user is unauthenticated', function() {
            before(function(done) {
                utils.resetEnvironment(app).then(function() {
                    done();
                });
            });
            it('should redirect an unauthenticated user to /', function(done) {
                request(app)
                .get('/logout')
                .expect(302)
                .end(function(err, res) {
                    expect(res.redirect).to.equal(true);
                    expect(res.header.location).to.equal('/');
                    done();
                });
            });
        });

        describe('Authenticated users', function() {
            var testUser;
            before(function(done) {
                utils.resetEnvironment(app).then(function() {
                    utils.authenticateTestUser().then(function(user) {
                        testUser = user;
                        done();
                    });
                });
            });
            after(function() {
                utils.unauthenticateTestUser();
            });

            it('should redirect an authenticated user to /', function(done) {
                request(app)
                .get('/logout')
                .expect(302)
                .end(function(err, res) {
                    expect(res.redirect).to.equal(true);
                    expect(res.header.location).to.equal('/');
                    done();
                });
            });
        });
    });


    describe('Auth callback redirecting', function() {
        before(function(done) {
            utils.resetEnvironment(app).then(function() {
                done();
            });
        });

        it('should redirect a user to their preferred role: student', function(done) {
            request(app)
            .get(utils.createTestAuthUrl('test', 1, 'test_token', 'test@email.com', 'Test Name', 'author'))
            .expect(302)
            .end(function(err, res) {
                expect(res.redirect).to.equal(true);
                expect(res.header.location).to.equal('/author');
                done();
            });
        });
    });
});







