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
                utils.resetEnvironment(app).then(function() {
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
                utils.resetEnvironment(app).then(function() {
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
        describe('when 4 qd in the db have (published hidden) values set to [(t,t), (f,t), (t,f), (f,f)]', function() {
            before(function(done) {
                utils.resetEnvironment(app).then(function() {
                    models.QuizDescriptor.create({
                        descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (t,t)'),
                        published: true,
                        hidden: true
                    }).then(function(qd) {
                        models.QuizDescriptor.create({
                            descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (t,f)'),
                            published: true,
                            hidden: false
                        }).then(function(qd) {
                            models.QuizDescriptor.create({
                                descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (f,t)'),
                                published: false,
                                hidden: true
                            }).then(function(qd) {
                                models.QuizDescriptor.create({
                                    descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (f,f)'),
                                    published: false,
                                    hidden: false
                                }).then(function(qd) {
                                    done();
                                });
                            });
                        });
                    });
                });
            });
            describe('when no query vars are set', function() {
                it("should retrieve all qd's", function(done) {
                    request(app)
                    .get('/api/qd')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body.length).to.equal(4);
                        done();
                    });
                });
            });
            describe('when query var published = true', function() {
                it("should retrieve all qd's where qd.published = true", function(done) {
                    request(app)
                    .get('/api/qd?published=true')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body.length).to.equal(2);
                        for (var i = 0; 2 > i; i++)
                            expect(res.body[i].published).to.be.true;
                        done();
                    });
                });
            });
            describe('when query var published = false', function() {
                it("should retrieve all qd's where qd.published = false", function(done) {
                    request(app)
                    .get('/api/qd?published=false')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body.length).to.equal(2);
                        for (var i = 0; 2 > i; i++)
                            expect(res.body[i].published).to.be.false;
                        done();
                    });
                });
            });
            describe('when query var hidden = true', function() {
                it("should retrieve all qd's where qd.hidden = true", function(done) {
                    request(app)
                    .get('/api/qd?hidden=true')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body.length).to.equal(2);
                        for (var i = 0; 2 > i; i++)
                            expect(res.body[i].hidden).to.be.true;
                        done();
                    });
                });
            });
            describe('when query var hidden = false', function() {
                it("should retrieve all qd's where qd.hidden = false", function(done) {
                    request(app)
                    .get('/api/qd?hidden=false')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        expect(res.body.length).to.equal(2);
                        for (var i = 0; 2 > i; i++)
                            expect(res.body[i].hidden).to.be.false;
                        done();
                    });
                });
            });
        });
    });
});





