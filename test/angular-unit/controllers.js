describe('Angular Controllers', function() {

	describe('InstructorCtrl', function() {
	    var AuthServiceMock = {};
  		var $controller, controller;
		beforeEach(function() {
			module('awesomeApp', function ($provide) {
				$provide.value('AuthService', AuthServiceMock);
		    });
			inject(function(_$controller_) {
				$controller = _$controller_;
			});
			var $scope = {  };
			controller = $controller('InstructorCtrl', { $scope: $scope });
		});

		describe('InstructorCtrl.authenticated', function() {

			describe('unauthenticated user', function() {
				before(function() {
					AuthServiceMock.isAuthenticated = function() { return false; }
				});
				it('should inititalize authenticated as false', function() {
					expect(controller.authenticated).to.be.false;
				});
			});

			describe('authenticated user', function() {
				before(function() {
					AuthServiceMock.isAuthenticated = function() { return true; }
				});
				it('should inititalize authenticated as true', function() {
					expect(controller.authenticated).to.be.true;
				});
			});

	  	});

		describe('navigationTabs', function() {
			it('should exist', function() {
				expect(controller.navigationTabs).to.exist;
			});
			it('should be an array', function() {
				expect(controller.navigationTabs).to.be.an('array');
			});

			describe('navigationTabs[i].label', function() {
				it('should have a label property of type string', function() {
					for (var i = 0; controller.navigationTabs.length > i; i++)
						expect(controller.navigationTabs[i].label).to.be.a('string');
				});
			});

			describe('navigationTabs[i].state', function() {
				it('should have a state property of type string', function() {
					for (var i = 0; controller.navigationTabs.length > i; i++)
						expect(controller.navigationTabs[i].state).to.be.a('string');
				});
			});

			describe('navigationTabs[i].loginRequired', function() {
				it('should have a loginRequired property of type boolean', function() {
					for (var i = 0; controller.navigationTabs.length > i; i++)
						expect(controller.navigationTabs[i].loginRequired).to.be.a('boolean');
				});
			});

			describe('navigationTabs[i].tooltip', function() {
				it('should have a tooltip property of type string iff the loginRequired property is true', function() {
					for (var i = 0; controller.navigationTabs.length > i; i++)
						if (controller.navigationTabs[i].loginRequired == true)
							expect(controller.navigationTabs[i].tooltip).to.be.a('string');
						else 
							expect(controller.navigationTabs[i].tooltip).to.be.undefined;
				});
			});

		});

	});
	
	describe('UserPrefCtrl', function() {
		
  		var $controller, controller;
		beforeEach(function() {

			module('awesomeApp', function ($provide) {
	            AuthServiceMock = {
					getRole : function() {
						return 'student';
					}
				};
				$provide.value('AuthService', AuthServiceMock);
		    });
			inject(function(_$controller_) {
				$controller = _$controller_;
			});
			var $scope = {  };
			controller = $controller('UserPrefCtrl', { $scope: $scope });
		});

		describe('roleSelection', function() {
			it('should be defined on start', function() {
				expect(controller.roleSelection).to.eql({ text: 'Student', value: 'student' });
			});
	  	});

		describe('selectRole(role)', function() {
			it('should set the roleSelection accordingly', function() {
				controller.selectRole({ text: 'Instructor', value: 'instructor' })
				expect(controller.roleSelection).to.eql({ text: 'Instructor', value: 'instructor' });
			});
	  	});
	  	
	});

	describe('QuestionExportCtrl', function() {
		var QuestionTypesMock = ['questionType1', 'questionType2'];
		var SeedGeneratorMock = {};
		SeedGeneratorMock.randomSeedMockReturn = '1234abcd';
		SeedGeneratorMock.getSeed = function() { return this.randomSeedMockReturn; }
		var WindowMock = {};
		WindowMock.url = '';
		WindowMock.target = '';
		WindowMock.open = function(url, target) {
			WindowMock.url = url;
			WindowMock.target = target;
		}
		var $controller, controller;

		beforeEach(function() {
			module('awesomeApp', function($provide) {
				$provide.value('QuestionTypes', QuestionTypesMock);
				$provide.value('SeedGenerator', SeedGeneratorMock);
				$provide.value('$window', WindowMock);
			});
			inject(function(_$controller_) {
				$controller = _$controller_;
			});
			controller = $controller('QuestionExportCtrl', { $scope: {}});
		});

		describe('questionTypes', function() {
			it('should be initialized to the QuestionTypes dependency', function() {
				expect(controller.questionTypes).to.equal(QuestionTypesMock);
			});
		});

		describe('questionTypeSelection', function() {
			it('should be initialized to the first element in QuestionType', function() {
				expect(controller.questionTypeSelection).to.equal(QuestionTypesMock[0]);
			});
		});

		describe('defaultCount', function() {
			it('should be initialized to 100', function() {
				expect(controller.defaultCount).to.equal(100);
			});
		});

		describe('minCount', function() {
			it('should be initialized to 1', function() {
				expect(controller.minCount).to.equal(1);
			});
		});

		describe('maxCount', function() {
			it('should be initialized to 1000', function() {
				expect(controller.maxCount).to.equal(1000);
			});
		});

		describe('getFile()', function() {

			describe('undefined seed', function() {

				it('should open window with seed param set to SeedGenerator result', function() {
					SeedGeneratorMock.randomSeedMockReturn = '01234567';
					controller.seed = null;
					controller.countSelection = 5;
					controller.getFile();
					expect(WindowMock.url).to.equal('/api/question/moodle/'+controller.questionTypeSelection+'/01234567?count=5');
					expect(WindowMock.target).to.equal('_blank');
				});
			});

			describe('undefined countSelection', function() {

				it('should open window with count param as defaultCount', function() {
					controller.seed = '11112222';
					controller.countSelection = null;
					controller.getFile();
					expect(WindowMock.url).to.equal('/api/question/moodle/'+controller.questionTypeSelection+'/11112222?count=' + controller.defaultCount);
					expect(WindowMock.target).to.equal('_blank');
				});
			});

		});
	});

	describe('QuizStartCtrl', function() {
  		var QDMock = {
			"id":1,
			"descriptor":{}
		};
		var StateParamsMock = { id: 1 };
		var SeedGeneratorMock = {
			isValidSeed: function(s) { return false; },
			getSeed: function() { return ''; }
		};
		var StateMock = {};
		var $controller, controller;
					
		beforeEach(function() {
			module('awesomeApp', function($provide) {
				$provide.value('qd', QDMock);
				$provide.value('$stateParams', StateParamsMock);
				$provide.value('SeedGenerator', SeedGeneratorMock);
				$provide.value('$state', StateMock);
			});
			inject(function(_$controller_) {
				$controller = _$controller_;
			});

			StateMock.currentState = "quizoptions";
			StateMock.currentParams = {};
			StateMock.go = function(state, params) { 
				this.currentState = state;
				this.currentParams = params;
			}
			controller = $controller('QuizStartCtrl', { $scope: {}});
		});

		describe('qd', function() {
			it('should be assigned the qd service result', function() {
				expect(controller.qd).to.equal(QDMock);
			});
		});

		describe('displayOption', function() {
			it('should initialize to the string "questions"', function() {
				expect(controller.displayOption).to.equal("questions");
			});
		});

		describe('seed', function() {
			it('should initialize as an empty string', function() {
				expect(controller.seed).to.equal("");
			});
		});

		describe('startQuiz', function() {

			beforeEach(function() {
				StateMock.currentState = "quizoptions";
				StateMock.currentParams = {};
			});

			describe('empty seed input', function() {
				before(function() {
					SeedGeneratorMock = {
						isValidSeed: function(s) { return false; },
						getSeed: function() { return 'aaaabbbb'; }
					};
				});
				it('should navigate to quiz page with the :seed set by SeedGenerator', function() {
					controller.startQuiz();
					expect(StateMock.currentState).to.equal('quiztake');
					expect(StateMock.currentParams.seed).to.equal('aaaabbbb');
					expect(StateMock.currentParams.id).to.equal(StateParamsMock.id);
				});
			});

			describe('non-empty valid seed input', function() {
				before(function() {
					SeedGeneratorMock = {
						isValidSeed: function(s) { return true; },
						getSeed: function() { return 'aaaabbbb'; }
					};
				});
				it('should navigate to quiz page without the s param set as the given seed', function() {
					controller.seed = 'abcd1234';
					controller.startQuiz();
					expect(StateMock.currentState).to.equal('quiztake');
					expect(StateMock.currentParams.seed).to.equal('abcd1234');
					expect(StateMock.currentParams.id).to.equal(StateParamsMock.id);
				});
			});

			describe('non-empty invalid seed input', function() {
				before(function() {
					SeedGeneratorMock = {
						isValidSeed: function(s) { return false; },
						getSeed: function() { return 'aaaabbbb'; }
					};
				});
				it('should not navigate to quiz page', function() {
					controller.seed = 'notvalidseed';
					controller.startQuiz();
					expect(StateMock.currentState).to.equal('quizoptions');
				});
			});

			describe('answers display option', function() {
				it('should navigate to quiz page with the params q = 1 and k = 0', function() {
					controller.displayOption = "questions";
					controller.startQuiz();
					expect(StateMock.currentParams.q).to.equal(1);
					expect(StateMock.currentParams.k).to.equal(0);
				});
			});
			
			describe('questions & answers display option', function() {
				it('should navigate to quiz page with the params q = 1 and k = 1', function() {
					controller.displayOption = "questions_answers";
					controller.startQuiz();
					expect(StateMock.currentParams.q).to.equal(1);
					expect(StateMock.currentParams.k).to.equal(1);
				});
			});
			
			describe('answers display option', function() {
				it('should navigate to quiz page with the params q = 0 and k = 1', function() {
					controller.displayOption = "answers";
					controller.startQuiz();
					expect(StateMock.currentParams.q).to.equal(0);
					expect(StateMock.currentParams.k).to.equal(1);
				});
			});
		});

	});

	describe('QuizCtrl', function() {
		var QuizMock = {
			"title":"First Fixture Example Quiz",
			"questions":[{
		        "question": "Convert 11011 from base 2 to octal.",
		        "answer": "33",
		        "format": "input"
		    }]
		};
		var StateParamsMock = {
			id: 1,
			seed : 'abcddcba',
			q : 1,
			k : 1
		};
		var $controller, controller;
		beforeEach(function() {
			module('awesomeApp', function($provide) {
				$provide.value('quiz', QuizMock);
				$provide.value('$stateParams', StateParamsMock);
			});
			inject(function(_$controller_) {
				$controller = _$controller_;
			});
			controller = $controller('QuizCtrl', { $scope: {}});
		});

		describe('compare(correctAnswer, userAnswer)', function() {
			describe('leading zeros', function() {
				it('should remove them then compare', function() {
					expect(controller.compare('01', '1')).to.be.true;
				});
			});
			describe('uppercase', function() {
				it('should make it lowercase then compare', function() {
					expect(controller.compare('aBC', 'AbC')).to.be.true;
				});
			});
			describe('only zero', function() {
				it('should still work', function() {
					expect(controller.compare('0', '00')).to.be.true;
					expect(controller.compare('00', '0')).to.be.true;
					expect(controller.compare('', '0')).to.be.true;
				});
			});
			describe('userAnswer is empty string', function() {
				it('should be wrong', function() {
					expect(controller.compare('0', '')).to.be.false;
				});
			});
			describe('userAnswer with whitespace', function() {
				it('should remove before comparing', function() {
					expect(controller.compare('12345', ' 1 2 3     4 5 ')).to.be.true;
				});
			});
		});

		describe('gradeQuiz()', function() {

			it('should set graded to true', function() {
				controller.gradeQuiz();
				expect(controller.graded).to.be.true;
			});

			it('should mark a question as incorrect if the userAnswer is not defined', function() {
				QuizMock.questions = [
					{
				        "question": "Convert 11011 from base 2 to octal.",
				        "answer": "33"
			    	}
			    ];
			    controller.gradeQuiz();
			    expect(controller.quiz.questions[0].isCorrect).to.be.false;
			});
			
			it('should mark a question as incorrect if the userAnswer does not match the answer property', function() {
				QuizMock.questions = [
					{
				        "question": "Convert 11011 from base 2 to octal.",
				        "answer": "33",
				        "userAnswer": "55"
			    	}
			    ];
			    controller.gradeQuiz();
			    expect(controller.quiz.questions[0].isCorrect).to.be.false;
			});
			
			it('should mark a question as correct if the userAnswer matches the answer property', function() {
				QuizMock.questions = [
					{
				        "question": "Convert 11011 from base 2 to octal.",
				        "answer": "33",
				        "userAnswer": "33"
			    	}
			    ];
			    controller.gradeQuiz();
			    expect(controller.quiz.questions[0].isCorrect).to.be.true;
			});

		});

		describe('graded', function() {
			it('should be initialized to false', function() {
				expect(controller.graded).to.be.false;
			});
		});

		describe('quiz', function() {

			it('should have set quiz to the quiz service result', function() {
				expect(controller.quiz).to.eql(QuizMock);
			});

		});

		describe('seed', function() {

			before(function() {
				StateParamsMock = { id: 6, s : 2, q : 0, k : 1 };
			});

			it('should set seed according to the stateParams', function() {
				expect(controller.seed).to.equal(StateParamsMock.seed);
			});

		});

		describe('showQuestions', function() {
			before(function() {
				StateParamsMock = { id: 6, s : 1, q : 0, k : 1 };
			});
			it('should set showQuestions according to the stateParams', function() {
				expect(controller.showQuestions).to.equal(StateParamsMock.q | 0);
			});

			describe('when showQuestions is not defined in stateParams', function() {
				before(function() {
					StateParamsMock = { id: 6, s : 1, k : 1 };
				});
				it('should use the default value of 1', function() {
					expect(controller.showQuestions).to.be.true;
				});
			});

			describe('when showQuestions is not 0 or 1 in stateParams', function() {
				before(function() {
					StateParamsMock = { id: 6, s : 1, q : 2, k : 1 };
				});
				it('should use the default value of 1', function() {
					expect(controller.showQuestions).to.be.true;
				});
			});

		});

		describe('showKey', function() {
			before(function() {
				StateParamsMock = { id: 6, s : 1, q : 0, k : 1 };
			});
			it('should set showKey according to the stateParams', function() {
				expect(controller.showKey).to.equal(StateParamsMock.k | 0);
			});

			describe('when showKey is not defined in stateParams', function() {
				before(function() {
					StateParamsMock = { id: 6, s : 1, q : 0 };
				});
				it('should use the default value of 0', function() {
					expect(controller.showKey).to.be.false;
				});
			});

			describe('when showKey is not 0 or 1 in stateParams', function() {
				before(function() {
					StateParamsMock = { id: 6, s : 1, q : 0, k : 2 };
				});
				it('should use the default value of 0', function() {
					expect(controller.showKey).to.be.false;
				});
			});

		});


	});
    
});

















