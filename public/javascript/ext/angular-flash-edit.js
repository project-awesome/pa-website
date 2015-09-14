(function() {
    'use strict';
    var app = angular.module('flash', []);

    app.run(['$rootScope', function($rootScope) {
        // initialize variables
        $rootScope.flash = {};
        $rootScope.flash.text = '';
        $rootScope.flash.type = '';
        $rootScope.flash.timeout = 5000;
        $rootScope.hasFlash = false;
    }]);

    // Directive for compiling dynamic html
    app.directive('dynamic', ['$compile', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }]);

    // Directive for closing the flash message
    app.directive('closeFlash', ['$compile', 'Flash', function($compile, Flash) {
        return {
            link: function(scope, ele) {
                ele.on('click', function() {
                    Flash.dismiss();
                });
            }
        };
    }]);

    // Create flashMessage directive
    app.directive('flashMessage', ['$compile', '$rootScope', function($compile, $rootScope) {
        return {
            restrict: 'A',
            template: '<div role="alert" ng-show="hasFlash" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible ng-hide alertIn alertOut "> <span dynamic="flash.text"></span> <button type="button" class="close" close-flash><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> </div>',
            link: function(scope, ele, attrs) {
                // get timeout value from directive attribute and set to flash timeout
                $rootScope.flash.timeout = parseInt(attrs.flashMessage, 10);
            }
        };
    }]);

    app.factory('Flash', ['$rootScope', '$timeout', '$interval',
        function($rootScope, $timeout, $interval) {

            var dataFactory = {},
                timeOut;

            // Create flash message
            dataFactory.create = function(type, text, addClass) {
                var $this = this;
                $interval.cancel(timeOut);
                $rootScope.flash.type = type;
                $rootScope.flash.text = text;
                $rootScope.flash.addClass = addClass;
                timeOut = $interval(function() {
                    $rootScope.hasFlash = true;
                }, 100, 1);
                timeOut = $interval(function() {
                    $this.dismiss();
                }, $rootScope.flash.timeout, 1);
            };

            // Cancel flashmessage timeout function
            dataFactory.pause = function() {
                $interval.cancel(timeOut);
            };

            // Dismiss flash message
            dataFactory.dismiss = function() {
                $interval.cancel(timeOut);
                timeOut = $interval(function() {
                    $rootScope.hasFlash = false;
                }, 1, 1);
            };
            return dataFactory;
        }
    ]);
}());