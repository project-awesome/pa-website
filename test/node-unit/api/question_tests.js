var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");
var xml2js = require('xml2js');

var app = require('../../../app.js');
var models = require('../../../models');
var testUser;


describe('Question Exporting API', function() {
    var seed = '1234abcd';
    describe('GET /api/question/moodle/:questionType/:seed', function() {

        var qd = {};

        describe('questionType', function() {

            describe('valid question types', function() {

                it('should respond with a valid xml file for changeOfBase', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed)
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(done);
                });

            });

            describe('invalid question types', function() {

                it('should respond with 404 not found', function(done) {
                    request(app)
                    .get('/api/question/moodle/questiontypeDNE/' + seed)
                    .expect(404)
                    .end(done);
                });

            });

        });

        describe('invalid seed', function() {
            it('should respond with 404 not found', function(done) {
                request(app)
                .get('/api/question/moodle/changeOfBase/' + '1234')
                .expect(404)
                .end(done);
            });
        });

        describe('count', function() {

            describe('when count is not specified', function() {

                it('should default to 20 questions', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed)
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        xml2js.parseString(res.text, function (err, result) {
                            if (err) return done(err);
                            expect(result.quiz.question.length).to.equal(20);
                            done();
                        });
                    });
                });

            }); 

            describe('when count is specified and is a valid integer', function() {

                it('should get that # of questions', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed + '?count=100')
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        xml2js.parseString(res.text, function (err, result) {
                            if (err) return done(err);
                            expect(result.quiz.question.length).to.equal(100);
                            done();
                        });
                    });
                });

            }); 

            describe('when count does not parse to an integer > 0 and < 1000', function() {

                it('should respond with 400 Bad Request', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed + '?count=a')
                    .expect(400)
                    .end(done);
                });

                it('should respond with 400 Bad Request', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed + '?count=1000')
                    .expect(400)
                    .end(done);
                });

                it('should respond with 400 Bad Request', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed + '?count=0')
                    .expect(400)
                    .end(done);
                });

                it('should respond with 400 Bad Request', function(done) {
                    request(app)
                    .get('/api/question/moodle/changeOfBase/' + seed + '?count=-1')
                    .expect(400)
                    .end(done);
                });

            }); 
        });

    });

});






