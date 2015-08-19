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








