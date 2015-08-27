describe('Angular Services', function() {


	describe('PAQuestions', function() {
		var PAQuestions;

		beforeEach(function() {
			module('awesomeApp');
		    inject(function(_PAQuestions_) {
		    	PAQuestions = _PAQuestions_;
		    });
		});

		describe('getQuestionTypes()', function() {

			it('should return an array', function() {
				expect(PAQuestions.getQuestionTypes()).to.be.an('array');
			});

			it('each element should be a string', function() {
				var questionTypes = PAQuestions.getQuestionTypes();
				for (var i = 0; questionTypes.length > i; i++) {
					expect(questionTypes[i]).to.be.a('string');
				}
			});

		});



	});
	
	describe('AuthService', function() {
		beforeEach(module('awesomeApp'));
  		var AuthService, cookies;
		var q, rootScope, deferred;
  		var RestangularMock = {};
  		var testUser;

		beforeEach(function() {
			module('awesomeApp', function($provide) {
				$provide.value('Restangular', RestangularMock);
			});

		    inject(function(_AuthService_, _$cookies_) {
		    	AuthService = _AuthService_;   
		    	cookies = _$cookies_;
		    });

		    testUser = {
	  			awesome_id: "1234",
	  			email: "test@email.com",
	  			name: "Test Name",
	  			role: "student"
	  		}

    		cookies.put('awesome_id',testUser.awesome_id);
    		cookies.put('email', testUser.email);
    		cookies.put('name', testUser.name);
    		cookies.put('role', testUser.role);
		});
		
		describe('getAwesomeId()', function() {
			it('should return the awesome_id cookie', function() {
				expect(AuthService.getAwesomeId()).to.equal(testUser.awesome_id);
			});
		});

		describe('getEmail()', function() {
			it('should return the email cookie', function() {
				expect(AuthService.getEmail()).to.equal(testUser.email);
			});
		});

		describe('getName()', function() {
			it('should return the name cookie', function() {
				expect(AuthService.getName()).to.equal(testUser.name);
			});
		});

		describe('getRole()', function() {
			it('should return the role cookie', function() {
				expect(AuthService.getRole()).to.equal(testUser.role);
			});
		});
		describe('isAuthenticated()', function() {
			it('should return true when awesome_id is defined', function() {
				expect(AuthService.isAuthenticated()).to.equal(true);
			});
			it('should return false when awesome_id is not defined', function() {
    			cookies.remove('awesome_id');
				expect(AuthService.isAuthenticated()).to.equal(false);
			});
		});

		describe('updateUser()', function() {
			var one = {};
	    	RestangularMock.one = function(path, awesome_id) {
				one.role = '';
				return one;
	    	}
			describe('successful Restangular put request', function() {
				before(function() {
					one.called = false;
					one.put = function() {
						one.called = true;
						return {
							then: function(calledback) {

							}
						}
					}
					AuthService.updateUser('author');
				});

				it('should expect Restangular to make an updated request', function() {
					expect(one.called).to.be.true;
				});
			});
		
		});
	
	});

	describe('SeedGenerator', function() {
		beforeEach(module('awesomeApp'));
  		var SeedGenerator;

		beforeEach(function() {
			module('awesomeApp');
		    inject(function(_SeedGenerator_) {
		    	SeedGenerator = _SeedGenerator_; 
		    });
		});
		
		describe('getSeed()', function() {

			it('should return a string', function() {
				expect(SeedGenerator.getSeed()).to.be.a('string');
			});

			it('should return a string of length 8', function() {
				expect(SeedGenerator.getSeed().length).to.equal(8);
			});

			it('should return a parsable hex string', function() {
				expect(parseInt(SeedGenerator.getSeed(), 16)).to.be.a('number');
			});

		});

		describe('isValidSeed(seed)', function() {

			it('should return false if the seed is not a string', function() {
				expect(SeedGenerator.isValidSeed(parseInt('1234abcd', 16))).to.be.false;
			});

			it('should return false if the seed has length > 8', function() {
				expect(SeedGenerator.isValidSeed('1234abcde')).to.be.false;
			});

			it('should return false if the seed has length < 8', function() {
				expect(SeedGenerator.isValidSeed('1234abc')).to.be.false;
			});

			it('should return false if the seed includes non hex characters', function() {
				expect(SeedGenerator.isValidSeed('1234abch')).to.be.false;
			});

			it('should return true if the seed is a valid 8 digit hex string', function() {
				expect(SeedGenerator.isValidSeed('1234abcd')).to.be.true;
			});

			it('should return true if the seed is a valid 8 digit hex string with uppercase characters', function() {
				expect(SeedGenerator.isValidSeed('1234ABCD')).to.be.true;
			});

		});
	
	});
    
});















