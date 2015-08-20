var request = require('supertest');
var expect = require("chai").expect;
var utils = require("../../utils");

var app = require('../../../app.js');
var models = require('../../../models');

var validDescriptor= utils.validDescriptor;

var testUser;

describe('User.QuizDescriptor API', function() {

	describe('GET /api/user/:awesome_id/qd', function() {
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
});
