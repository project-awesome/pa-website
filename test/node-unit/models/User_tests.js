var expect = require("chai").expect;
var models = require('../../../models');


function expectEqualUsers(user1, user2) {
  expect(user1.awesome_id).to.equal(user2.awesome_id);
  expect(user1.account_type).to.equal(user2.account_type);
  expect(user1.id).to.equal(user2.id);
  expect(user1.token).to.equal(user2.token);
  expect(user1.email).to.equal(user2.email);
  expect(user1.name).to.equal(user2.name);
}

describe('User Model', function(){
  var testUser = { 
    awesome_id: 1, 
    account_type: "google",
    id: "some_id",
    token: "some token",
    email: "some@email.com",
    name: "Some Name" 
  }

  beforeEach(function(done) {
    models.sequelize.sync({ force: true }).then(function() {
      done();
    });
  });

  it('should create a new user', function(done){
    models.User.create(testUser).then(function(user) {
      expectEqualUsers(user, testUser);
      done();
    });
  });
  it('should create and find user with (awesome_id)', function(done){
    models.User.create(testUser).then(function(user) {
      expectEqualUsers(user, testUser);
      models.User.findOne({
        where: { awesome_id: testUser.awesome_id }
      }).then(function(user) {
        expectEqualUsers(user, testUser);
        done();
      });
    });
  });

  it('should create and find user with (id, account_type)', function(done){
    models.User.create(testUser).then(function(user) {
      expectEqualUsers(user, testUser);
      models.User.findOne({
        where: { id: testUser.id, account_type: testUser.account_type }
      }).then(function(user) {
        expectEqualUsers(user, testUser);
        done();
      });
    });
  });

  it('should create and delete a user', function(done){
    models.User.create(testUser).then(function(user) {
      expectEqualUsers(user, testUser);
      user.destroy().then(function(user) {
        done();
      });
    });
  });


  it('should create a user with a default start page prefence set to student', function(done){
    models.User.create(testUser).then(function(user) {
      models.User.findOne({
        where: { awesome_id: testUser.awesome_id }
      }).then(function(user) {
        expect(user.role).to.equal('student');
        done();
      });
    });
  });

});

// Mocha cheatsheet
/*
describe('test suite', function () {
  beforeEach(function() { 
  	// ...
  });
  afterEach(function() { 
  	// ...
  });

  before(function() { 
  	// ...
  });
  after(function() { 
  	// ...
  });

  it('a basic test', function() { 
  	// ...
  });

  it('a test with a promise', function() {
    return somePromiseObject; });

  it('an asynchronous test', function(next) {
    if (success) { next(); } else { next(error); }
  });

  xit('use "xit" for pending tests', function() { 
  	// ...
  });
});
*/

// Chai cheatsheet
/*
expect(3).to.eql(2);

expect(obj).to.be.a('string');
expect(obj).to.be.null;
expect(obj).to.be.true;
expect(obj).to.be.false;
expect(obj).to.be.undefined;

expect(list).to.include("item");
expect(list).to.have.length(3);
expect(list).to.have.length.gt(0);
*/


