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
        { 
            name: "binHexOctDec",
            schema: {
                type: "object",
                properties: {
                    repeat: { type: "integer", title: "Repeat", minimum: 1 },
                    parameters: { 
                        type: "object",
                        title: "Parameters",
                        properties: {
                            spaceBinary: { type: "boolean", title: "Space Binary" },
                            conversions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        fromRad: { type: "integer", title: "From Radix", minimum: 2, maximum: 36 },
                                        toRad: { type: "integer", title: "To Radix", minimum: 2, maximum: 36 },
                                        minVal: { type: "integer", title: "Minium Value", minimum: 0 },
                                        maxVal: { type: "integer", title: "Minium Value", minimum: 0 }
                                    }

                                }
                            }
                        }
                    }
                }
            },
            form: ["*"],
            template: {
                repeat: 1,
                question: 'binHexOctDec',
                parameters: {
                    spaceBinary: true,
                    conversions: []
                }
            }
        },
        { 
            name: "changeOfBase",
            schema: {
                type: "object",
                properties: {
                    repeat: { type: "integer", title: "Repeat", minimum: 1 },
                }
            },
            form: ["*"],
            template: {
                repeat: 1,
                question: 'changeOfBase'
            }
        }
    ];

    function getQuestionByType(questionType) {
        for (var i = 0; questions.length > i; i++)
            if (questions[i].name === questionType)
                return questions[i];
        throw "Question Type Not Found: " + questionType + " is not a project awesome question.";
    }

    paQuestions.getQuestionTypes = function() {
        return questions.map(function(q) { return q.name });
    }

    paQuestions.getSchemaDefinition = function(questionType) {
        return getQuestionByType(questionType).schema;
    }

    paQuestions.getFormDefinition = function(questionType) {
        return getQuestionByType(questionType).form;
    }

    paQuestions.getTemplate = function(questionType) {
        return getQuestionByType(questionType).template;
    } 

    return paQuestions;
}]);







