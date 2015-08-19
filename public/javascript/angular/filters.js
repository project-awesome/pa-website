'use strict';

awesomeApp.filter('indexToLetter', function() {
	return function(index) {
		return (index >= 0 && index <= 25) ? String.fromCharCode(97 + index) : index;
	};
});


