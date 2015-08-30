var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");

var app = require('../../../app.js');
var models = require('../../../models');
var testUser;


describe('User API', function() {
  describe('PUT /api/user/:awesome_id', function() {

    describe('when users are unauthenticated', function() {

      before(function(done) {
          utils.resetEnvironment(app).then(function() {
            done();
          });
      });

      it('should respond 403 Forbidden even when missing role parameter', function(done) {
        request(app)
        .put('/api/user/1')
        .expect(403)
        .end(done);
      });

      it('should respond 403 Forbidden even if role is not one of the 4 options', function(done) {
        request(app)
        .put('/api/user/1')
        .send({role: 'somethingelse'})
        .expect(403)
        .end(done);
      });

      it('should respond 403 Forbidden even if everything is correct', function(done) {
        request(app)
        .put('/api/user/1')
        .send({role: 'author'})
        .expect(403)
        .end(done);
      });
    });

    describe('Authenticated User', function() {
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

      it('should respond 403 Forbidden if user is not authenticated as given awesome_id', function(done) {
        request(app)
        .put('/api/user/' + 10 + testUser.awesome_id)
        .expect(403)
        .end(done);
      });

      it('should respond 400 Bad Request if missing role parameter', function(done) {
        request(app)
        .put('/api/user/' + testUser.awesome_id)
        .expect(400)
        .end(done);
      });

      it('should respond 400 Bad Request if role is anything but student, instructor, author, or developer', function(done) {
        request(app)
        .put('/api/user/1')
        .send({role: 'somethingelse'})
        .expect(400)
        .end(done);
      });

      it('should respond 200 and json object user if successful', function(done) {
        request(app)
        .put('/api/user/1')
        .send({role: 'author'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.role).to.equal('author');
          done();
        });
      });
    });
  


  });
});
  








