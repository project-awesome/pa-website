'use strict';

awesomeApp.controller("ShowDescriptorCtrl", ['qd', function(qd) {
    var vm = this;
    vm.qd = qd;
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
        { label: "My Quiz Descriptors", state: "instructor.myquizdescriptors", loginRequired: true, tooltip: "You must be signed in to create quiz descriptors"},
        { label: "Export Questions", state: "instructor.export", loginRequired: false},
    ];
    vm.authenticated = AuthService.isAuthenticated();
    return vm;
}]);

awesomeApp.controller('QuestionExportCtrl', ['QuestionTypes', 'SeedGenerator', '$window', function(QuestionTypes, SeedGenerator, $window) {
    var vm = this;
    vm.questionTypes = QuestionTypes;
    vm.questionTypeSelection = QuestionTypes[0];
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
    vm.quiz = quiz;
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

awesomeApp.controller('QuizDescriptorCtrl', [ 'qds', 'Flash', 'Restangular', function(qds, Flash, Restangular) {
    var vm = this;
    vm.quizzes = qds;
    vm.quizDescriptorText = "";

    vm.clickedDescriptor = function(selection) {
        window.location.href = '/showpage/' + selection.id;
    }
    vm.addQuizDescriptor = function() {
        var qdJSON;
        try {
            qdJSON = JSON.parse(vm.quizDescriptorText);
        } catch (e) {
            Flash.create('warning', '<strong id="flash-strong"> Not Saved:</strong>  Invalid Syntax.', 'custom-class');
            return;
        }
        Restangular.all('qd').post({descriptor: qdJSON})
        .then(function(qd) {
            Flash.create('success', '<strong> Quiz Descriptor Saved:</strong>  id = ' + qd.id + '.', 'custom-class');
            vm.quizzes.push(qd);
            vm.quizDescriptorText = "";
        }, function(error) {
            Flash.create('warning', '<strong> Not Saved:</strong>  Invalid Syntax.', 'custom-class');
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









