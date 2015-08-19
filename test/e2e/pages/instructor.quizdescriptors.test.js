var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/instructor/quizdescriptors', function() {
	var qd, testUser;
    before(function(done) {
        models.sequelize.sync({ force: true }).then(function () {
            server = app.listen(app.get('port'), function() {
	            models.sequelize.sync({ force: true }).then(function () {
	                utils.insertQuizDescriptor(models, 'Example Quiz Descriptor Title').then(function(res) {
	                    qd = res;
                        utils.protractorLogin().then(function(user) {
                            testUser = user;
                            browser.get('/instructor/quizdescriptors').then(function() {
                                done();
                            });
                        });
	                });
	            });
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('quiz descriptor list', function() {
        it('should contain all quiz descriptors', function(done) {
            expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(1);
            expect(element(by.repeater('quiz in quizDescriptors.quizzes').row(0).column('quiz.id')).getText()).to.eventually.equal(qd.id+'');
            expect(element(by.repeater('quiz in quizDescriptors.quizzes').row(0).column('quiz.descriptor')).getText()).to.eventually.include(JSON.stringify(qd.descriptor).substring(0,80));
            done();
        });
    });

    describe('Add New', function() {
        var addNew, textArea;
        before(function(done) {
            addNew = element(by.buttonText('Add New'));
            textArea = element(by.id('comment'));
            done();
        });

        beforeEach(function(done) {
            textArea.clear();
            done();
        });

        describe('invalid quiz descriptor', function() {
            it('should not add the qd to the list', function(done) {
                textArea.sendKeys('{"ayyyy":"lmao"}');
                addNew.click();
                expect(element(by.id('flash-message-div')).isPresent()).to.eventually.be.true;
                expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(1);
                expect(textArea.getAttribute('value')).to.eventually.equal('{"ayyyy":"lmao"}');
                done();
            });
        });
        


        describe('valid quiz descriptor', function() {
            it('should add the qd to the list and display a success flash message', function(done) {
                var sampleQD = utils.getSampleQuizDescriptor('testQD1');
                textArea.sendKeys(JSON.stringify(sampleQD));
                addNew.click();
                expect(element(by.id('flash-message-div')).isPresent()).to.eventually.be.true;
                expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(2);
                expect(textArea.getAttribute('value')).to.eventually.equal("");
                done();
            });
        });
    });

});











