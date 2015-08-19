var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TestStrategy;
if (process.env.NODE_ENV != 'production') {
    TestStrategy = require('passport-local').Strategy;
}
var models = require('../models');



module.exports = function(passport) {


    // Session Setup

    // serializes user for session
    passport.serializeUser(function(user, done) {
        done(null, user.awesome_id);
    });

    // deserializes user
    passport.deserializeUser(function(id, done) {
        models.User.findOne({
          where: {awesome_id: id}
        }).then(function(user) {
            done(null, user);
        }).catch(function(error) {
            done(error, null);
        });
    });


    // Used by google and facebook authentication results
    function authResult(type, token, refreshToken, profile, done) {
        // try to find the user based on their id
        models.User.findOne({
          where: { id: profile.id, account_type: type }
        }).then(function(user) {
          if (user) {
            return done(null, user);
          } else {
            var newUser = {
                account_type : type,
                id: profile.id,
                token: token,
                email: profile.emails[0].value,
                name: profile.displayName
            };
            if (process.env.NODE_ENV != 'production')
                newUser.role = profile.role;
            models.User.create(newUser).then(function(createdUser) {
                return done(null, createdUser);
            }); // don't catch error
          }
        }).catch(function(error) {
            return done(error);
        });
    }

    // GOOGLE ============================================================
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_APP_ID,
        clientSecret : process.env.GOOGLE_APP_SECRET,
        callbackURL : process.env.GOOGLE_CALLBACK_URL
    },
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            authResult("google", token, refreshToken, profile, done);
        });

    }));

    // FACEBOOK ==========================================================
    passport.use(new FacebookStrategy({
        clientID        : process.env.FACEBOOK_APP_ID,
        clientSecret    : process.env.FACEBOOK_APP_SECRET,
        callbackURL     : process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["emails", "displayName", "name"]
    },
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            profile.displayName = profile.name.givenName + " " + profile.name.familyName;
            authResult("facebook", token, refreshToken, profile, done);
        });

    }));


    // TESTING ==========================================================
    if (process.env.NODE_ENV != 'production') {
        passport.use('local-login', new TestStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password,  done) {
            process.nextTick(function() {
                profile = {
                    role: req.query.role,
                    id: req.query.id,
                    emails: [{ value: email }],
                    displayName: req.query.name
                }
                authResult(req.query.account_type, req.query.token, "some_test_refresh_token_1234", profile, done);
            });

        }));
    }
    


}




