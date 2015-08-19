var models = require('../models');
var utils = require('../test/utils');

var quizDescriptorFixtures = [
  { descriptor : utils.getSampleQuizDescriptor("First Fixture Example Quiz") },
  { descriptor : utils.getSampleQuizDescriptor("Second Fixture Example Quiz") },
  { descriptor : utils.getSampleQuizDescriptor("Third Fixture Example Quiz") }
];



module.exports.loadAllFixtures = function(models) {
  for (var i = 0; quizDescriptorFixtures.length > i; i++) {
      models.QuizDescriptor.create(quizDescriptorFixtures[i]);
  }
}

















