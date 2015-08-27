'use strict';

var awesomeApp = angular.module('awesomeApp', ['schemaForm', 'ngCookies', 'ui.router', 'ui.bootstrap', 'flash', 'restangular', 'ngAnimate', 'ui.tree']);
awesomeApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
    
    RestangularProvider.setBaseUrl('/api');

	$locationProvider.html5Mode({
		enabled: true
	});
	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'partials/index.html'
	})
	.state('student', {
		url: '/student',
		templateUrl: 'partials/student.html',
		controller: 'QuizListCtrl',
		controllerAs: 'quizDescriptors',
		resolve: {
			qds: ['Restangular', function(Restangular) {
				return Restangular.all('qd').getList({ hidden: false, published: true });
			}]
		}
	})
	.state('instructor', {
		url: '/instructor',
		templateUrl: 'partials/instructor.html',
		controller: 'InstructorCtrl',
		controllerAs: 'instructorCtrl'
	})
	.state('instructor.allquizdescriptors', {
		url: '/allquizdescriptors',
		templateUrl: 'partials/instructor.allquizdescriptors.html',
		controller: 'QuizListCtrl',
		controllerAs: 'quizDescriptors',
		resolve: {
			qds: ['Restangular', function(Restangular) {
				return Restangular.all('qd').getList({ hidden: false, published: true });
			}]
		}
	})
	.state('instructor.myquizdescriptors', {
		url: '/myquizdescriptors',
		templateUrl: 'partials/instructor.quizdescriptors.html',
		controller: 'QuizListCtrl',
		controllerAs: 'quizDescriptors',
		resolve: {
			qds: ['Restangular', 'AuthService', function(Restangular, AuthService) {
				return Restangular.one('user', AuthService.getAwesomeId()).getList('qd');
			}]
		}
	})
	.state('instructor.export', {
		url: '/export',
		templateUrl: 'partials/instructor.export.html',
		controller: 'QuestionExportCtrl',
		controllerAs: 'exporter'

	})
	.state('developer', {
		url: '/developer',
		templateUrl: 'partials/developer.html'
	})
	.state('author', {
		url: '/author',
		templateUrl: 'partials/author.html'
	})
	.state('login', {
		url: '/login',
		templateUrl: 'partials/login.html'
	})
	.state('usersettings', {
		url: '/usersettings',
		templateUrl: 'partials/usersettings.html',
		controller: 'UserPrefCtrl',
		controllerAs: 'preferences'
	})
	.state('quizoptions', {
		url: '/quiz/:id',
		templateUrl: 'partials/quizoptions.html',
		controller: 'QuizStartCtrl',
		controllerAs: 'quizStarter',
		resolve: {
			qd: ['Restangular', '$stateParams', function(Restangular, $stateParams) {
				return Restangular.one('qd', $stateParams.id).get();
			}]
		}
	})
	.state('quiztake', {
		url: '/quiz/:id/{seed:[0-9a-fA-F]{8}}?q&k',
		templateUrl: 'partials/quiz.html',
		controller: 'QuizCtrl',
		controllerAs: 'quizCtrl',
		resolve: {
			quiz: ['Restangular', 'SeedGenerator', '$stateParams', function(Restangular, SeedGenerator, $stateParams) {
				return Restangular.one('quiz', $stateParams.id).customGET($stateParams.seed);
			}]
		}
	})
	.state('quizdescriptor', {
		url: '/quizdescriptor/:id',
		templateUrl: 'partials/quizdescriptor.html',
		controller: 'QuizDescriptorCtrl',
		controllerAs: 'qdCtrl',
		resolve: {
			qd: ['Restangular', '$stateParams', function(Restangular, $stateParams) {
				return Restangular.one('qd', $stateParams.id).get();
			}]
		}
	})
    .state('quizsettings', {
        abstract: true,
        url: '/quizdescriptor/:id/settings',
        templateUrl: 'partials/quizsettings.html',
        controller: 'NavigationCtrl',
        controllerAs: 'navCtrl',
        resolve: {
        	tabs: function() {
        		return [
			        { label: "General", state: "quizsettings.general"},
			        { label: "Questions", state: "quizsettings.questions"}
			    ];
        	}
        }
    })
	.state('quizsettings.general', {
		url: '/general',
		templateUrl: 'partials/quizsettings.general.html',
		controller: 'QuizDescriptorCtrl',
		controllerAs: 'qdCtrl',
		resolve: {
			qd: ['Restangular', 'AuthService', '$stateParams', function(Restangular, AuthService, $stateParams) {
				return Restangular.one('qd', $stateParams.id).get().then(function(qd) {
					if (qd.UserAwesomeId != AuthService.getAwesomeId())
						throw { status: 404 };
					else
						return qd;
				});
			}]
		}
	})
	.state('quizsettings.questions', {
		url: '/questions',
		templateUrl: 'partials/quizsettings.questions.html',
		controller: 'QuizDescriptorCtrl',
		controllerAs: 'qdCtrl',
		resolve: {
			qd: ['Restangular', 'AuthService', '$stateParams', function(Restangular, AuthService, $stateParams) {
				return Restangular.one('qd', $stateParams.id).get().then(function(qd) {
					if (qd.UserAwesomeId != AuthService.getAwesomeId())
						throw { status: 404 };
					else
						return qd;
				});
			}]
		}
	})
	.state('404', {
		templateUrl: 'partials/404.html',
	});


	$urlRouterProvider.otherwise(function($injector, $location){
		var state = $injector.get('$state');
		state.go('404');
		return $location.path();
	});
}])
.run(['AuthService', 'Flash', '$rootScope', '$state', '$window', function(AuthService, Flash, $rootScope, $state, $window) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		if (error.status == 404) {
			event.preventDefault();
			$state.go('404');
		}
	});

	$rootScope.$on( "$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
		Flash.dismiss();
		var requiresAuth = ['instructor.myquizdescriptors', 'usersettings', 'quizsettings.general'];
		var requiresUnauth = ['login'];
		var authenticated = AuthService.isAuthenticated();
		if (!authenticated) {
			// redirect user to login page if they try to access user settings page
			if (requiresAuth.indexOf(toState.name) != -1) {
				event.preventDefault();
				$state.go("login");
			}

		} else {
			// redirect user to preferred page if they try to access login page
			if (requiresUnauth.indexOf(toState.name) != -1) {
				event.preventDefault();
				$state.go(AuthService.getRole());
			}
 
		}

	});

	$rootScope.$on("$stateChangeSuccess", function(event) {
		$window.ga('send', 'pageview', { page: $state.current.url });
	});
}]);


















