var models = require('../models');
var utils = require('../test/utils');

var quizDescriptorFixtures = [
  { descriptor : utils.getSampleQuizDescriptor(), published: true, title: "First Fixture Example Quiz" },
  { descriptor : utils.getSampleQuizDescriptor(), published: true, title: "Second Fixture Example Quiz" },
  { descriptor : utils.getSampleQuizDescriptor(), published: true, title: "Third Fixture Example Quiz" }
];



module.exports.loadAllFixtures = function(models) {
  for (var i = 0; quizDescriptorFixtures.length > i; i++) {
      models.QuizDescriptor.create(quizDescriptorFixtures[i]);
  }
}

















