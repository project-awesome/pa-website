var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");

var app = require('../../../app.js');
var models = require('../../../models');

var validDescriptor= utils.validDescriptor;

var testUser;

describe('User.QuizDescriptor API', function() {

	describe('GET /api/user/:awesome_id/qd', function() {

		describe('when query filter params not set', function() {

			var validAwesomeId, invalidAwesomeId;
			before(function(done) {
				utils.resetEnvironment(app).then(function() {
					utils.authenticateTestUser().then(function(user) {
						testUser = user;
						validAwesomeId = testUser.awesome_id;
						invalidAwesomeId = testUser.awesome_id+5;
						done();
					});
				});
			});
			after(function() {
				utils.unauthenticateTestUser();
			});

		    describe('when no users exists as the given awesome_id', function() {
				it('should give status 404', function(done) {
					request(app)
					.get('/api/user/'+invalidAwesomeId+'/qd')
					.expect(404)
					.end(function(err, res) {
						if (err) return done(err);
						done();
					});
				});
		    });

		    describe('request when awesome_id coressponds to user that has 2 quiz descriptors', function() {
		    	var qds;
		    	before(function(done) {
		    		qds = [];
		    		// delete all of testUser's qds
		    		// create one qd belonging to testUser
		    		// create one qd not belonging to testUser
		    		models.QuizDescriptor.destroy({ where: { UserAwesomeId: testUser.awesome_id} }).then(function() {
		    			testUser.createQuizDescriptor({ descriptor: utils.getSampleQuizDescriptor("Test User's First QD") }).then(function(res) {
		    				qds.push(res);
			    			testUser.createQuizDescriptor({ descriptor: utils.getSampleQuizDescriptor("Test User's Second QD") }).then(function(res2) {
			    				qds.push(res2);
			    				models.QuizDescriptor.create({descriptor: utils.getSampleQuizDescriptor("Not Test User's")}).then(function() {
			    					done();
			    				});
			    			});
		    			});
		    		});
		    	});

				it('should give status 200', function(done) {
					request(app)
					.get('/api/user/'+validAwesomeId+'/qd')
					.expect(200)
					.end(function(err, res) {
						if (err) return done(err);
						done();
					});
				});

				it('should return an array of size 2', function(done) {
					request(app)
					.get('/api/user/'+validAwesomeId+'/qd')
					.end(function(err, res) {
						if (err) return done(err);
						expect(res.body.length).to.equal(2);
						done();
					});
				});

				it('should return the two qds that belong to testUser', function(done) {
					request(app)
					.get('/api/user/'+validAwesomeId+'/qd')
					.end(function(err, res) {
						if (err) return done(err);
						expect(res.body[0].id == qds[0].id || res.body[0].id == qds[1].id).to.be.true;
						expect(res.body[1].id == qds[0].id || res.body[1].id == qds[1].id).to.be.true;
						done();
					});
				});
		    });
		});

		describe('query filter vars', function() {
			before(function(done) {
				utils.resetEnvironment(app).then(function() {
					utils.authenticateTestUser().then(function(user) {
						testUser = user;
						validAwesomeId = testUser.awesome_id;
						invalidAwesomeId = testUser.awesome_id+5;
						done();
					});
				});
			});
			after(function() {
				utils.unauthenticateTestUser();
			});
			describe('when 4 qd in the db have (published hidden) values set to [(t,t), (f,t), (t,f), (f,f)]', function() {

	            before(function(done) {
                    testUser.createQuizDescriptor({
                        descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (t,t)'),
                        published: true,
                        hidden: true
                    }).then(function(qd) {
                        testUser.createQuizDescriptor({
                            descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (t,f)'),
                            published: true,
                            hidden: false
                        }).then(function(qd) {
                            testUser.createQuizDescriptor({
                                descriptor: utils.getSampleQuizDescriptor('Sample QD Title for (f,t)'),
                                published: false,
                                hidden: true
                            }).then(function(qd) {
                                testUser.createQuizDescriptor({
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
	            describe('when no query vars are set', function() {
	                it("should retrieve all qd's", function(done) {
	                    request(app)
	                    .get('/api/user/'+testUser.awesome_id+'/qd')
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
	                    .get('/api/user/'+testUser.awesome_id+'/qd?published=true')
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
	                    .get('/api/user/'+testUser.awesome_id+'/qd?published=false')
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
	                    .get('/api/user/'+testUser.awesome_id+'/qd?hidden=true')
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
	                    .get('/api/user/'+testUser.awesome_id+'/qd?hidden=false')
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
});
