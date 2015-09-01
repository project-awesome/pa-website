var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");

var app = require('../../../app.js');
var models = require('../../../models');

var projectAwesome = require("project-awesome");

var validDescriptor= utils.validDescriptor;
var server;

describe('Quiz API', function() {

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



  describe('GET /api/quiz/:id/:seed', function() {
    var qd = {};
    before(function(done) {
      models.sequelize.sync({ force: true }).then(function () {
        utils.insertQuizDescriptor(models, 'Sample Quiz Descriptor').then(function(newQD) {
          qd = newQD;
          done();
        });
      });
    });

    describe('no seed', function() {
        it('should respond with 404 Not Found if missing the seed param', function(done) {
            request(app)
            .get('/api/quiz/1')
            .expect(404)
            .end(done);
        });
    });

    describe('invalid seed', function() {

      describe('seed is not a hex', function() {

        it('should respond with 404 not found', function(done) {
            request(app)
            .get('/api/quiz/'+qd.id+'/1234567t')
            .expect(404)
            .end(done);
        });

      });

      describe('seed is a hex, but has length > 8', function() {

        it('should respond with 404 Not Found if the seed is not an 8 digit hex string', function(done) {
          request(app)
          .get('/api/quiz/'+qd.id+'/123456f')
          .expect(404)
          .end(done);
        });

      });

      describe('seed is a hex, but has length < 8', function() {

        it('should respond with 404 Not Found if the seed is not an 8 digit hex string', function(done) {
          request(app)
          .get('/api/quiz/'+qd.id+'/12345678f')
          .expect(404)
          .end(done);
        });

      });

    });

    describe('valid seed, valid id', function() {

      it('should respond with 200 and a valid json quiz with seed set correctly', function(done) {
          request(app)
          .get('/api/quiz/'+qd.id+'/1234abcd')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body.quiz.seed).to.equal('1234abcd');
            expect(projectAwesome.QuizValidator.isValid(res.body.quiz)).to.be.true;
            done();
          });
      });

    });

    describe('valid seed, but no quiz with the given id exists', function() {
      before(function(done) {
        models.sequelize.sync({ force: true }).then(function () {
          done();
        });
      });

      it('should response with 404 not found', function(done) {
        request(app)
        .get('/api/quiz/'+qd.id+'/1234abcd')
        .expect(404)
        .end(done);
      });

    });
    


  });
});




















