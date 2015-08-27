'use strict';

awesomeApp.factory("AuthService",['$cookies', 'Restangular', function($cookies, Restangular) {
    var authService = {};

	authService.isAuthenticated = function() {
		return (typeof $cookies.get('awesome_id') !== 'undefined');
	}
    authService.getAwesomeId = function() {
        return $cookies.get('awesome_id');
    }
    authService.getEmail = function() {
        return $cookies.get('email');
    }
    authService.getName = function() {
        return $cookies.get('name');
    }
    authService.getRole = function() {
        return $cookies.get('role');
    }

    authService.updateUser = function (role) {
        var me = Restangular.one('user',$cookies.get('awesome_id'));
        me.role = role;
        return me.put().then(function(user) {
            $cookies.put('role', user.role);
            return user;
        });
    }

	return authService;
}]);

awesomeApp.factory('SeedGenerator', [function() {
    var generator = {};
    generator.getSeed = function() {
        var newHexString = (Math.floor(Math.random() * (0xFFFFFFFF + 1))).toString(16);
        while (newHexString.length < 8)
            newHexString = '0'+newHexString;
        return newHexString;
    }
    generator.isValidSeed = function(seed) {
        return (typeof seed === 'string' && seed.match(/^[a-fA-F0-9]{8}$/) !== null && seed.length == 8);
    }
    return generator;
}]);

awesomeApp.factory('PAQuestions', [function() {
    var paQuestions = {};
    var questions = [
        { name: "binHexOctDec" },
        { name: "changeOfBase" }
    ];

    generator.getQuestionTypes = function() {
        return questions.map(function(q) { return q.name });
    }

    return paQuestions;
}]);













