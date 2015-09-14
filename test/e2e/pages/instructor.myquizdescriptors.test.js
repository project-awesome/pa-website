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
                    tu.createQuizDescriptor( { descriptor: utils.getSampleQuizDescriptor() } ).then(function(res) {
                        testUsersOnlyQD = res;
                        models.QuizDescriptor.create({ descriptor: utils.getSampleQuizDescriptor() } ).then(function() {
                            browser.get('/instructor/myquizdescriptors').then(function() {
                                done();
                            });
                        });
                    });
                });
            });
        });

        it('should contain one item in the list', function() {
            expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(1);
        });

        describe("quiz id ", function() {
            it("should correspond to that of testUser's only qd", function() {
                expect(element(by.repeater('quiz in quizDescriptors.quizzes').row(0).column('quiz.id')).getText()).to.eventually.equal(testUsersOnlyQD.id+'');
            });
        });

    });

    describe('Add New', function() {
        var addNew, titleInput, flashMessageDiv;
        before(function(done) {
            browser.get('/instructor/myquizdescriptors').then(function() {
                addNew = element(by.buttonText('Add New'));
                titleInput = element(by.id('quiz-title-input'));
                flashMessageDiv = element(by.id('flash-message-div'));
                done();
            });
        });

        beforeEach(function(done) {
            titleInput.clear();
            done();
        });

        describe('when no title has been entered', function() {
            it('should be disabled', function(done) {
                expect(addNew.isEnabled()).to.eventually.be.false;
                done();
            });
        });

        describe('valid title', function() {
            it('should add the qd to the list, display a success flash message, and clear input', function(done) {
                titleInput.sendKeys('Test Title');
                addNew.click();
                expect(flashMessageDiv.isPresent()).to.eventually.be.true;
                expect(flashMessageDiv.getText()).to.eventually.include('Quiz Descriptor Saved: id =');
                expect(element.all(by.repeater('quiz in quizDescriptors.quizzes')).count()).to.eventually.equal(2);
                expect(titleInput.getAttribute('value')).to.eventually.equal("");
                done();
            });
        });
    });

});











