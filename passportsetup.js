const passport=require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID='898105800464-ttnhos97qbj5kt3q2dbdrebbba7lfgib.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET='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'
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/createquiz"
  },
  function(accessToken, refreshToken, profile, cb) {
   
      return cb(err, user);

  }
));

passport.serializeUser(function(user,done){
    done(null,user);
});

passport.deserializeUser(function(user,done){
    done(null,user);
});