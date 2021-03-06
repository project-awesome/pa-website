'use strict';

awesomeApp.controller("ConfirmationModalCtrl", ['$modalInstance', 'title', 'description', 'okText', 'cancelText', function($modalInstance, title, description, okText, cancelText) {
    var vm = this;
    vm.title = title;
    vm.description = description;
    vm.okText = okText;
    vm.cancelText = cancelText;
    vm.ok = function () {
        $modalInstance.close();
    };

    vm.cancel = function () {
        $modalInstance.dismiss();
    };

}]);

awesomeApp.controller("QuizDescriptorCtrl", ['qd', 'AuthService', 'Flash', '$modal', 'PAQuestions', function(qd, AuthService, Flash, $modal, PAQuestions) {
    var vm = this;
    vm.qd = qd;
    vm.isOwner = AuthService.getAwesomeId() == qd.UserAwesomeId;
    vm.waitingForResponse = false;
    vm.questionTypes = PAQuestions.getQuestionTypes();

    vm.addNewQuestion = function(questionType) {
        vm.qd.descriptor.questions.unshift(PAQuestions.getTemplate(questionType));
    }

    vm.saveSettings = function() {
        vm.waitingForResponse = true;
        vm.qd.customPUT({ hidden: vm.qd.hidden, title: vm.qd.title }).then(function(newQD) {
            vm.waitingForResponse = false;
            vm.qd = newQD;
            Flash.create('success', '<strong> Quiz Descriptor Saved:</strong>  id = ' + qd.id + '.', 'custom-class');
        }, function() {
            vm.waitingForResponse = false;
            Flash.create('warning', '<strong> Not Saved:</strong>  Something went wrong.', 'custom-class');
        });
    }

    vm.saveQuestions = function() {
        vm.waitingForResponse = true;
        vm.qd.customPUT({ descriptor: vm.qd.descriptor }).then(function(newQD) {
            vm.waitingForResponse = false;
            vm.qd = newQD;
            Flash.create('success', '<strong> Success:</strong>  Quiz descriptor saved.', 'custom-class');
        }, function() {
            vm.waitingForResponse = false;
            Flash.create('warning', '<strong> Not Saved:</strong>  Something went wrong.', 'custom-class');
        });
    }

    vm.publishQuizConfirm = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'templates/confirmation-modal.html',
            controller: 'ConfirmationModalCtrl',
            controllerAs: 'ctrl',
            size: 'lg',
            resolve: {
                title: function(){ return 'Are you sure?'; },
                description: function(){ return 'This action cannot be reversed. Once your quiz is published you can not make any changes to the questions.'; },
                okText: function(){ return 'Publish'; },
                cancelText: function(){ return 'Cancel'; }
            }
        });
        modalInstance.result.then(function () {
            vm.publishQuiz();
        }, function() {

        });
    }

    vm.publishQuiz = function() {
        vm.waitingForResponse = true;
        vm.qd.customPUT({published:true}).then(function(newQD) {
            vm.waitingForResponse = false;
            vm.qd = newQD;
            Flash.create('success', '<strong> Quiz Published:</strong>  Your quiz is now published!', 'custom-class');
        }, function() {
            vm.waitingForResponse = false;
            Flash.create('warning', '<strong> Not Published:</strong>  Something went wrong.', 'custom-class');
        });
    }

    vm.openQuestionSettings = function(i) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'templates/question-parameter-editor.html',
            controller: 'QuestionEditCtrl',
            controllerAs: 'questionCtrl',
            size: 'lg',
            resolve: {
                question: function () {
                    return angular.copy(vm.qd.descriptor.questions[i]);
                },
                state: function() {
                    return { published: vm.qd.published };
                }
            }
        });
        modalInstance.result.then(function (question) {
            vm.qd.descriptor.questions[i] = question;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }
    

    return vm;
    
}]);


awesomeApp.controller("QuestionEditCtrl", ['question', '$modalInstance', 'PAQuestions', 'state', '$scope', function(question, $modalInstance, PAQuestions, state, $scope) {

    var vm = this;
    vm.published = state.published;
    vm.options = { 
        supressPropertyTitles: true, 
        formDefaults: { 
            readonly: 
            state.published, 
            startEmpty: true, 
            feedback: false, 
            style: { 
                add: 'btn-primary' 
            }
        } 
    };
    vm.model = question;
    vm.schema = PAQuestions.getSchemaDefinition(vm.model.question);
    vm.form = PAQuestions.getFormDefinition(vm.model.question);

    vm.done = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            $modalInstance.close(vm.model);
        }
    };

    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    return vm;
}]);

awesomeApp.controller("NavigationCtrl", ['tabs', function(tabs) {
    var vm = this;
    vm.tabs = tabs;
    return vm;
}]);

awesomeApp.controller("AuthController", ['$window', 'AuthService', function($window, AuthService) {
    var vm = this;
    vm.isAuthenticated = AuthService.isAuthenticated();
    vm.user = {};

    if (AuthService.isAuthenticated())
        vm.user.name = AuthService.getName();

    vm.facebook = function() {
        $window.location.href = "/auth/facebook";
    }

    vm.google = function() {
        $window.location.href = "/auth/google";
    }

    vm.logout = function() {
        $window.location.href = "/logout";
    }

    return vm;
    
}]);

awesomeApp.controller('InstructorCtrl', ['AuthService', function(AuthService) {
    var vm = this;
    vm.navigationTabs = [
        { label: "Instructor", state: "instructor", loginRequired: false},
        { label: "All Quiz Descriptors", state: "instructor.allquizdescriptors", loginRequired: false},
        { label: "My Quiz Descriptors", state: "instructor.myquizdescriptors", loginRequired: true, tooltip: "You must be signed in to create quiz descriptors"},
        { label: "Export Questions", state: "instructor.export", loginRequired: false}
    ];
    vm.authenticated = AuthService.isAuthenticated();
    return vm;
}]);

awesomeApp.controller('QuestionExportCtrl', ['PAQuestions', 'SeedGenerator', '$window', function(PAQuestions, SeedGenerator, $window) {
    var vm = this;
    vm.questionTypes = PAQuestions.getQuestionTypes();
    vm.questionTypeSelection = vm.questionTypes[0];
    vm.defaultCount = 100;
    vm.minCount = 1;
    vm.maxCount = 1000;

    vm.getFile = function() {
        var questionType = vm.questionTypeSelection;
        var count = vm.countSelection ? vm.countSelection : vm.defaultCount;
        var seed = vm.seed ? vm.seed : SeedGenerator.getSeed();
        $window.open('/api/question/moodle/' + questionType + '/' + seed + '?count=' + count, '_blank');
    }

    return vm;
}]);

awesomeApp.controller('QuizCtrl', [ 'quiz', '$stateParams', function(quiz, $stateParams) {
    var vm = this;
    vm.quiz = quiz.quiz;
    vm.id = $stateParams.id;
    vm.title = quiz.title;
    vm.seed = $stateParams.seed;
    vm.showQuestions = true;
    vm.showKey = false;
    if ($stateParams.q == 1 || $stateParams.q == 0)
        vm.showQuestions = $stateParams.q | 0;
    if ($stateParams.k == 1 || $stateParams.k == 0)
        vm.showKey = $stateParams.k | 0;

    vm.graded = false;

    vm.compare = function(correctAnswer, userAnswer) {
        if (userAnswer == '' || typeof userAnswer != 'string') return false;
        var ca = correctAnswer.replace(/ /g,'').toLowerCase().replace(/^0+/, '');
        var ua = userAnswer.replace(/ /g,'').toLowerCase().replace(/^0+/, '');
        return ca == ua;
    }

    vm.gradeQuiz = function() {
        for (var i = 0; vm.quiz.questions.length > i; i++) {
            var userAnswer = vm.quiz.questions[i].userAnswer;
            var answer = vm.quiz.questions[i].answer;
            if (vm.quiz.questions[i].format == 'input') {
                vm.quiz.questions[i].isCorrect = vm.compare(answer, userAnswer);
            } else {
                vm.quiz.questions[i].isCorrect = (answer == userAnswer);
            }
        }
        vm.graded = true;
    }


    return vm;
}]);

awesomeApp.controller('QuizStartCtrl', [ 'qd', 'SeedGenerator', '$stateParams', '$state', function(qd, SeedGenerator, $stateParams, $state) {
    var vm = this;
    
    vm.qd = qd;
    vm.displayOption = "questions";
    vm.seed = "";

    vm.startQuiz = function() {
        if (vm.seed !== "" && !SeedGenerator.isValidSeed(vm.seed))
            return;
        var seed = vm.seed;
        var query = {};
        if (seed === "")
            seed = SeedGenerator.getSeed();
        query.q = (vm.displayOption !== "answers") ? 1 : 0;
        query.k = (vm.displayOption !== "questions") ? 1 : 0;
        query.id = $stateParams.id;
        query.seed = seed;
        $state.go('quiztake', query);
    }
    
    return vm;
}]);

awesomeApp.controller('QuizListCtrl', [ 'qds', 'Flash', 'Restangular', function(qds, Flash, Restangular) {
    var vm = this;
    vm.quizzes = qds;
    vm.quizDescriptorTitle = "";
    
    vm.addQuizDescriptor = function() {
        Restangular.all('qd').post({descriptor: { questions:[], version:"0.1" }, title: vm.quizDescriptorTitle })
        .then(function(qd) {
            Flash.create('success', '<strong> Quiz Descriptor Saved:</strong>  id = ' + qd.id + '.', 'custom-class');
            vm.quizzes.push(qd);
            vm.quizDescriptorTitle = "";
        }, function(error) {
            Flash.create('warning', '<strong> Not Saved:</strong>  Something went wrong...', 'custom-class');
        });
    }

    
    return vm;
}]);

awesomeApp.controller('UserPrefCtrl', [ '$scope', 'AuthService', 'Flash', function($scope, AuthService, Flash) {
    function roleValueToJSON(roleValue) {
        return { text: roleValue.charAt(0).toUpperCase() + roleValue.slice(1), value: roleValue };
    }
    var vm = this;
    vm.roles = [
        { text: 'Student', value: 'student' },
        { text: 'Instructor', value: 'instructor' },
        { text: 'Author', value: 'author' },
        { text: 'Developer', value: 'developer'}
    ];
    vm.roleSelection = roleValueToJSON(AuthService.getRole());

    vm.selectRole = function(role) {
        vm.roleSelection = role;
    }

    vm.updatePreferences = function() {
        AuthService.updateUser(vm.roleSelection.value)
        .then(function(user) {
            Flash.create('success', '<strong> Updated:</strong>  Your settings have been saved.');
        }, function(error) {

        });
    }


    return vm;

}]);









