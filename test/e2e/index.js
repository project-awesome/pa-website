
    /*
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var app = require('../../app.js');
var models = require('../../models');
var server;

describe('End-to-End Tests', function() {
    before(function(done) {
        models.sequelize.sync({ force: true }).then(function () {
            server = app.listen(app.get('port'), function() {
                console.log('Node app is running on port', server.address().port);
                browser.get('/').then(function() {
                    done();
                });
            });
        });
    });

    after(function() {
        server.close();
    });

    describe('Protractor and Selenium', function () {

        it('should expose the correct protractor global variables', function() {
            expect(protractor).to.exist;
            expect(browser).to.exist;
            expect(by).to.exist;
            expect(element).to.exist;
            expect($).to.exist;
        });

    });
    describe('Facebook Authenticated', function () {
        before(function() {
            browser.ignoreSynchronization = true;
        });
        after(function() {
            browser.ignoreSynchronization = false;
        });
        it('should login using Facebook auth', function(done) {
            browser.get('/');
            browser.findElement(by.id('facebook-login')).click();
            browser.findElement(by.id('email')).sendKeys(process.env.FACEBOOK_TEST_EMAIL);
            browser.findElement(by.id('pass')).sendKeys(process.env.FACEBOOK_TEST_PASSWORD);
            browser.findElement(by.id('u_0_2')).click();

            element(by.name('__CONFIRM__')).isPresent().then(function(result) {
                if ( result ) {
                    browser.findElement(by.name('__CONFIRM__')).click();
                    browser.sleep(1000);
                }
            });
            done();
        });
    });

    
});
*/





















