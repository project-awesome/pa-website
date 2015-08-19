var expect = require("chai").expect;

describe('Environment Variables', function() {
    describe('process.env.NODE_ENV', function() {
        it('should be set', function() {
            expect(process.env.NODE_ENV).to.not.equal('production');
        });
    });
    describe('process.env.DATABASE_URL', function() {
        it('should be set', function() {
            expect(process.env.DATABASE_URL).to.exist;
        });
    });
    describe('process.env.FACEBOOK_APP_ID', function() {
        it('should be set', function() {
            expect(process.env.FACEBOOK_APP_ID).to.exist;
        });
    });
    describe('process.env.FACEBOOK_APP_SECRET', function() {
        it('should be set', function() {
            expect(process.env.FACEBOOK_APP_SECRET).to.exist;
        });
    });
    describe('process.env.FACEBOOK_CALLBACK_URL', function() {
        it('should be set', function() {
            expect(process.env.FACEBOOK_CALLBACK_URL).to.exist;
        });
    });
    describe('process.env.GOOGLE_APP_ID', function() {
        it('should be set', function() {
            expect(process.env.GOOGLE_APP_ID).to.exist;
        });
    });
    describe('process.env.GOOGLE_APP_SECRET', function() {
        it('should be set', function() {
            expect(process.env.GOOGLE_APP_SECRET).to.exist;
        });
    });
    describe('process.env.GOOGLE_CALLBACK_URL', function() {
        it('should be set', function() {
            expect(process.env.GOOGLE_CALLBACK_URL).to.exist;
        });
    });

    // this is optional for now
    describe('', function() {
        it('should be set', function() {
            //expect(process.env.SESSION_SECRET).to.exist;
        });
    });
    
});
