var expect = require("chai").expect;
var models = require('../../../models');
var utils = require('../../utils');

var testUser;


var validDescriptor = utils.validDescriptor;


describe('QuizDescriptor', function() {

  beforeEach(function(done) {
    models.sequelize.sync({ force: true }).then(function() {
      models.User.create({ 
        account_type: "google",
        id: "some_id",
        token: "some token",
        email: "some@email.com",
        name: "Some Name",
        role: "author"
      }).then(function(user) {
        testUser = user;
        done();
      });
    });
  });

  describe('hidden property', function() {
    describe('default value when unspecified', function() {
      var res;
      before(function(done) {
        models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
          res = qd;
          done();
        });
      });
      after(function(done) {
        res.destroy().then(function() {
          done();
        });
      });
      it('should be set to false', function(done) {
        expect(res.hidden).to.be.false;
        done();
      });
    });
    describe('when specified as true', function() {
      var res;
      before(function(done) {
        models.QuizDescriptor.create({descriptor: validDescriptor, hidden: true}).then(function(qd) {
          res = qd;
          done();
        });
      });
      after(function(done) {
        res.destroy().then(function() {
          done();
        });
      });
      it('should be set to true', function(done) {
        expect(res.hidden).to.be.true;
        done();
      });
    });
  });

  it('shouldcreate a quiz descriptor', function(done){
    models.QuizDescriptor.create({descriptor: validDescriptor}).then(function(qd) {
      expect(qd.descriptor).to.eql(validDescriptor);
      done();
    });
  });

  it('should use the testUser to create a quiz descriptor', function(done){
    testUser.createQuizDescriptor({descriptor: validDescriptor}).then(function(qd) {
      expect(qd.descriptor).to.eql(validDescriptor);
      done();
    });
  });

  it('should create one quiz descriptor for user, and retrieve all expecting 1', function(done){
    testUser.createQuizDescriptor({descriptor: validDescriptor}).then(function(qd) {
      testUser.getQuizDescriptors().then(function(results) {
        expect(results.length).to.equal(1);
        expect(results[0].descriptor).to.eql(validDescriptor);
        done();
      });
    });
  });

  it('should create two quiz descriptor for user, and retrieve all expecting 2', function(done){
    testUser.createQuizDescriptor({descriptor: validDescriptor}).then(function(qd1) {
      testUser.createQuizDescriptor({descriptor: validDescriptor}).then(function(qd2) {
        testUser.getQuizDescriptors().then(function(results) {
          expect(results.length).to.equal(2);
          expect(results[0].descriptor).to.eql(validDescriptor);
          expect(results[1].descriptor).to.eql(validDescriptor);
          done();
        });
      });
    });
  });

});








