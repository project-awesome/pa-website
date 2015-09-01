var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");

var app = require('../../../app.js');
var models = require('../../../models');

var validDescriptor= utils.validDescriptor;



describe('QuizDescriptor API', function() {

    describe('PUT /api/qd/:id', function() {
        describe('unauthenticated user', function() {
            var testUser, qd;
            before(function(done) {
                utils.resetEnvironment(app).then(function() {
                    models.QuizDescriptor.create({descriptor: utils.getSampleQuizDescriptor()}).then(function(res) {
                        qd = res;
                        done();
                    });
                });
            });
            it('should respond with error 403', function(done) {
                request(app)
                .put('/api/qd/'+qd.id)
                .send({hidden: false})
                .expect(403)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
            it('should respond with error 403 even when its a bad request', function(done) {
                request(app)
                .put('/api/qd/'+qd.id)
                .send({ descriptor: { questions : null } })
                .expect(403)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });
        describe('Authenticated User', function() {
            var testUser, myQD, notMyQD;
            before(function(done) {
                utils.resetEnvironment(app).then(function() {
                    utils.insertQuizDescriptor(models, 'Example Quiz Descriptor Title').then(function(res1) {
                        notMyQD = res1;
                        utils.authenticateTestUser().then(function(user) {
                            testUser = user;
                            testUser.createQuizDescriptor( { descriptor: utils.getSampleQuizDescriptor() } ).then(function(res2) {
                                myQD = res2;
                                done();
                            });
                        });
                    });
                });
            });
            after(function() {
                utils.unauthenticateTestUser();
            });

            describe('when request is made for qd that doesnt belong to authenticated user', function() {
                it('should respond with error 403', function(done) {
                    request(app)
                    .put('/api/qd/'+notMyQD.id)
                    .send({hidden: false})
                    .expect(403)
                    .end(function(err, res) {
                        if (err) return done(err);
                        done();
                    });
                });
                it('should respond with error 403 even when its a bad request', function(done) {
                    request(app)
                    .put('/api/qd/'+notMyQD.id)
                    .send({ descriptor: { questions : null } })
                    .expect(403)
                    .end(function(err, res) {
                        if (err) return done(err);
                        done();
                    });
                });
            });

            describe('when user makes a request for a qd that does not exist', function() {
                it('should respond with error 404', function(done) {
                    request(app)
                    .put('/api/qd/'+(myQD.id+10000))
                    .send({hidden: false})
                    .expect(403)
                    .end(function(err, res) {
                        if (err) return done(err);
                        done();
                    });
                });
                it('should respond with error 404 even when its a bad request', function(done) {
                    request(app)
                    .put('/api/qd/'+(myQD.id+10000))
                    .send({ descriptor: { questions : null } })
                    .expect(403)
                    .end(function(err, res) {
                        if (err) return done(err);
                        done();
                    });
                });
            });

            describe('when user is the owner of the given qd', function() {
                describe('non object body', function() {
                    it('should respond with error 400', function(done) {
                        request(app)
                        .put('/api/qd/'+myQD.id)
                        .send("ayy lmao")
                        .expect(400)
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                    });
                });
                describe('empty body', function() {
                    it('should respond with error 400', function(done) {
                        request(app)
                        .put('/api/qd/'+myQD.id)
                        .send({})
                        .expect(400)
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                    });
                });

                describe('updating descriptor', function() {
                    describe('when descriptor is not valid', function() {
                        it('should respond with error 400', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({descriptor:{"ayy":"lmao"}})
                            .expect(400)
                            .end(function(err, res) {
                                if (err) return done(err);
                                done();
                            });
                        });
                    });
                    describe('when descriptor is valid', function() {
                        describe('when the user has already published the quiz', function() {
                            before(function(done) {
                                myQD.updateAttributes({published:true}).then(function() {
                                    done();
                                });
                            });
                            after(function(done) {
                                myQD.updateAttributes({published:false}).then(function() {
                                    done();
                                });
                            });
                            it('should respond with error 400', function(done) {
                                request(app)
                                .put('/api/qd/'+myQD.id)
                                .send({descriptor:utils.getSampleQuizDescriptor()})
                                .expect(400)
                                .end(function(err, res) {
                                    if (err) return done(err);
                                    done();
                                });
                            });
                        });
                        describe('when the user has not already published the quiz', function() {
                            before(function(done) {
                                myQD.updateAttributes({published:false}).then(function() {
                                    done();
                                });
                            });
                            it('should respond with 200 and with body where qd.descriptor has been updated', function(done) {
                                var newDescriptor = utils.getSampleQuizDescriptor();
                                request(app)
                                .put('/api/qd/'+myQD.id)
                                .send({descriptor:newDescriptor})
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) return done(err);
                                    expect(res.body.descriptor).to.eql(newDescriptor);
                                    done();
                                });
                            });
                        });
                    });
                });
                describe('updating published', function() {
                    describe('when setting published to false when it is true', function() {
                        before(function(done) {
                            myQD.updateAttributes({published:true}).then(function() {
                                done();
                            });
                        });
                        after(function(done) {
                            myQD.updateAttributes({published:false}).then(function() {
                                done();
                            });
                        });
                        it('should respond with error 400', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({published:false})
                            .expect(400)
                            .end(function(err, res) {
                                if (err) return done(err);
                                done();
                            });
                        });
                    });
                    describe('when setting published to true', function() {
                        it('should respond with 200 and body with qd where qd.published == true', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({published:true})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                expect(res.body.published).to.equal(true);
                                done();
                            });
                        });
                    });
                    describe('when published is not a boolean', function() {
                        it('should respond with error 400', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({published:'true'})
                            .expect(400)
                            .end(function(err, res) {
                                if (err) return done(err);
                                done();
                            });
                        });
                    });
                });
                describe('updating hidden', function() {
                    describe('when setting to false', function() {
                        it('should respond with 200 and with body where qd.hidden == false', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({hidden:false})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                expect(res.body.hidden).to.be.false;
                                done();
                            });
                        });
                    });
                    describe('when setting to true', function() {
                        it('should respond with 200 and with body where qd.hidden == true', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({hidden:true})
                            .expect(200)
                            .end(function(err, res) {
                                if (err) return done(err);
                                expect(res.body.hidden).to.be.true;
                                done();
                            });
                        });
                    });
                    describe('when published is not a boolean', function() {
                        it('should respond with error 400', function(done) {
                            request(app)
                            .put('/api/qd/'+myQD.id)
                            .send({hidden:'true'})
                            .expect(400)
                            .end(function(err, res) {
                                if (err) return done(err);
                                done();
                            });
                        });
                    });
                });
            });

        });

    });

    describe('POST /api/qd', function() {
        var testUser;
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

            it('should give status 200 and return json { descriptor: {...}, title: "..." } if successful', function(done) {

                request(app)
                .post('/api/qd')
                .send({descriptor: validDescriptor, title: "My Title"})
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body.descriptor).to.eql(validDescriptor);
                    expect(res.body.title).to.equal('My Title');
                    expect(res.body.id).to.be.a('number');
                    done();
                });
            });

        });

    });

    describe('GET /api/qd/:id', function() {
        var testUser;
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
        var testUser;
        describe('when 4 qd in the db have (published hidden) values set to [(t,t), (f,t), (t,f), (f,f)]', function() {
            before(function(done) {
                utils.resetEnvironment(app).then(function() {
                    models.QuizDescriptor.create({
                        descriptor: utils.getSampleQuizDescriptor(),
                        published: true,
                        hidden: true
                    }).then(function(qd) {
                        models.QuizDescriptor.create({
                            descriptor: utils.getSampleQuizDescriptor(),
                            published: true,
                            hidden: false
                        }).then(function(qd) {
                            models.QuizDescriptor.create({
                                descriptor: utils.getSampleQuizDescriptor(),
                                published: false,
                                hidden: true
                            }).then(function(qd) {
                                models.QuizDescriptor.create({
                                    descriptor: utils.getSampleQuizDescriptor(),
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





