const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require("dotenv");
const User = require("../models/customerUsers");
dotenv.config();

passport.serializeUser( (user, done)=> {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(async(id, done)=> {
       const user = await User.findById(id);
        done(err, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/user/google/callback",
    //profileFields   : ['id','displayName','name','gender','picture.type(large)','email'],
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    console.log(profile)
    console.log("token",accessToken)
    const googleId = profile.id;
    const firstname = profile.name.givenName;
    const lastname = profile.name.familyName;
    const email = profile.emails[0].value;
    
    const existingUser = await User.findOne({googleId:googleId});

    if(existingUser){
        console.log("existing user",existingUser)
    done(null, existingUser);
    }else{
        const user = await User.create({googleId:googleId,
        firstname:firstname, lastname:lastname, email:email,token:accessToken})
        done(null,user)
    }
}));
