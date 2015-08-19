var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");

var app = require('../../../app.js');
var models = require('../../../models');

var validDescriptor= utils.validDescriptor;

var testUser;

describe('QuizDescriptor API', function() {

  describe('POST /api/qd', function() {

    describe('Unauthenticated User', function() {
      before(function(done) {
          utils.resetEnvironment(app, models).then(function() {
            done();
          });
      });

      it('should return 403 Forbidden if user is not authenticated and post is NOT formatted correctly', function(done) {
        request(app)
        .post('/api/qd')
        .send({descriptor: '{something: "blah"}'})
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });
      it('should return 403 Forbidden if user is not authenticated and post IS formatted correctly', function(done) {
        request(app)
        .post('/api/qd')
        .send({descriptor: validDescriptor})
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });


    });

    describe('Authenticated User', function() {
      before(function(done) {
          utils.resetEnvironment(app, models).then(function() {
            utils.authenticateTestUser().then(function(user) {
              testUser = user;
              done();
            });
          });
      });
      after(function() {
          utils.unauthenticateTestUser();
      });

      it('should return 400 Bad Request if missing descriptor parameter', function(done) {
        request(app)
        .post('/api/qd')
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });

      it('should return 400 Bad Request if the descriptor syntax is invalid', function(done) {
        request(app)
        .post('/api/qd')
        .send({descriptor: '{something: "blah"}'})
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });

      it('should give status 200 and return json { descriptor: {...} } if successful', function(done) {

        request(app)
        .post('/api/qd')
        .send({descriptor: validDescriptor})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.descriptor).to.eql(validDescriptor);
          expect(res.body.id).to.be.a('number');
          done();
        });
      });

    });

  });

  describe('GET /api/qd/:id', function() {

    describe('Unauthenticated User', function() {
      before(function(done) {
          utils.resetEnvironment(app, models).then(function() {
            done();
          });
      });

      it('should return 400 Bad Request if id is not an integer', function(done) {
        request(app)
        .get('/api/qd/a')
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });

      it('should return 404 not found if quiz does not exist', function(done) {
        request(app)
        .get('/api/qd/0')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });

      it('should give status 200 if successful', function(done) {
        models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
          request(app)
          .get('/api/qd/' + qd.id)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body.descriptor).to.eql(validDescriptor);
            expect(res.body.id).to.be.a.number;
            done();
          });
        });
      });



    });

    describe('Authenticated User', function() {
      before(function(done) {
          utils.resetEnvironment(app, models).then(function() {
            utils.authenticateTestUser().then(function(user) {
              testUser = user;
              done();
            });
          });
      });
      after(function() {
          utils.unauthenticateTestUser();
      });

      it('should return 400 Bad Request if id is not an integer', function(done) {
        request(app)
        .get('/api/qd/a')
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });

      it('should return 404 not found if quiz does not exist', function(done) {
        request(app)
        .get('/api/qd/0')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
      });

      it('should give status 200 if successful', function(done) {
        models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
          request(app)
          .get('/api/qd/' + qd.id)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body.descriptor).to.eql(validDescriptor);
            expect(res.body.id).to.be.a.number;
            done();
          });
        });
      });

    });

  });



  describe('GET /api/qd', function() {

    describe('Unauthenticated User', function() {
      before(function(done) {
          utils.resetEnvironment(app, models).then(function() {
            done();
          });
      });
      it('should give status 200 if successful and return all items (2 here)', function(done) {
        models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
          models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
            request(app)
            .get('/api/qd')
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              expect(res.body.length >= 2);
              done();
            });
          });
        });
      });


    });

    describe('Authenticated User', function() {
      before(function(done) {
        utils.resetEnvironment(app, models).then(function() {
          utils.authenticateTestUser().then(function(user) {
            testUser = user;
            done();
          });
        });
      });
      after(function() {
        utils.unauthenticateTestUser();
      });

      it('should give status 200 if successful and return all items (2 here)', function(done) {
        models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
          models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
            request(app)
            .get('/api/qd')
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              expect(res.body.length >= 2);
              done();
            });
          });
        });
      });

    });

  });
});





