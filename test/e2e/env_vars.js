var chai = require('chai');
var expect = chai.expect;


describe('Environment Variables', function() {
	describe('process.env.FACEBOOK_TEST_EMAIL', function() {
		it('should be set', function() {
			expect(process.env.FACEBOOK_TEST_EMAIL).to.exist;
		});
	});
	describe('process.env.FACEBOOK_TEST_PASSWORD', function() {
		it('should be set', function() {
    		expect(process.env.FACEBOOK_TEST_PASSWORD).to.exist;
		});
	});
	describe('process.env.GOOGLE_TEST_EMAIL', function() {
		it('should be set', function() {
    		expect(process.env.GOOGLE_TEST_EMAIL).to.exist;
		});
	});
	describe('process.env.GOOGLE_TEST_PASSWORD', function() {
		it('should be set', function() {
    		expect(process.env.GOOGLE_TEST_PASSWORD).to.exist;
		});
	});
});