var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var app = require('../../../app.js');
var models = require('../../../models');
var utils = require('../../utils');
var server;


describe('/instructor/myquizdescriptors', function() {
	var testUser;
    before(function(done) {
        server = app.listen(app.get('port'), function() {
            utils.resetEnvironment(app).then(function() {
                utils.authenticateTestUser().then(function(user) {
                    testUser = user;
                    done();
                });
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('quiz descriptor list', function() {
        var testUsersOnlyQD;
        before(function(done) {
            // Delete all qds that belong to testUser
            // Insert one qd that doesn't belong to testUser
            // Insert one qd that does belong to testUser
            // Make sure the list only contains the one qd that belongs to testUser
            models.QuizDescriptor.destroy({ where: { UserAwesomeId: testUser.awesome_id} }).then(function() {
                models.User.findOne({ where: {awesome_id: testUser.awesome_id } }).then(function(tu) {
                    tu.createQuizDescriptor( { descriptor: utils.getSampleQuizDescriptor("Test User's QD") } ).then(function(res) {
                        testUsersOnlyQD = res;
                        models.QuizDescriptor.create({ descriptor: utils.getSampleQuizDescriptor("Not Test User's QD") } ).then(function() {
                            browser.get('/instructor/myquizdescriptors').then(function() {
                                done();
                            });
                        });
                    });
                });
            });
        });

        it('should contain one item in the list', function(done) {
            expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(1);
            done();
        });

        describe("quiz id ", function() {
            it("should correspond to that of testUser's only qd", function(done) {
                expect(element(by.repeater('quiz in quizDescriptors.quizzes').row(0).column('quiz.id')).getText()).to.eventually.equal(testUsersOnlyQD.id+'');
                done();
            });
        });

    });

    describe('Add New', function() {
        var addNew, textArea, flashMessageDiv;
        before(function(done) {
            browser.get('/instructor/myquizdescriptors').then(function() {
                addNew = element(by.buttonText('Add New'));
                textArea = element(by.id('comment'));
                flashMessageDiv = element(by.id('flash-message-div'));
                done();
            });
        });

        beforeEach(function(done) {
            textArea.clear();
            done();
        });

        describe('invalid quiz descriptor', function() {
            it('should not add the qd to the list', function(done) {
                textArea.sendKeys('{"ayyyy":"lmao"}');
                addNew.click();
                expect(flashMessageDiv.getText()).to.eventually.include('Not Saved: Invalid Syntax.');
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
                expect(flashMessageDiv.isPresent()).to.eventually.be.true;
                expect(flashMessageDiv.getText()).to.eventually.include('Quiz Descriptor Saved: id =');
                expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(2);
                expect(textArea.getAttribute('value')).to.eventually.equal("");
                done();
            });
        });
    });

});











