const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;
// * Models
const User = require("../models/user");


// * Gettingup Passport google strategy
passport.use( 
  new googleStrategy(
    {
      clientID: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      callbackURL: "/auth/login/callback",
      passReqToCallback: true,
      proxy: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const defaultUser = {
        name:`${profile.name.givenName} ${profile.name.familyName}`,
        email:profile.emails[0].value,
        profilePicLink:profile.photos[0].value,
        googleId:profile.id,
      }
      
      let user = await User.findOne({
        email: profile.email,
      });
      if(!user){
        user = new User(defaultUser)
        user.save();
      }
      else
      {
        user.profilePicLink=profile.photos[0].value 
        user.googleId=profile.id
        user.save();
      }
      done(null, {user: user, id: user._id, accessToken});
    }
  )
);

// * Passport serializeUser
passport.serializeUser((obj, done) => {
  console.log("Serializing User: ",obj)
  done(null, obj);
});

// * Passport deserializeUser
passport.deserializeUser(async (obj, done) => {
  console.log("Deserlializing");
  done(null, obj);
});
