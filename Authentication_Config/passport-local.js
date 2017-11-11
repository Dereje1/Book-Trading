// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local', also added my own
    //Strategy local-passchange for changing passwords

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // I am not using email as the default username if I was i would change the
        //username property to custom properties like : usernameField.. see http://www.passportjs.org/docs/configure

        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, 'That username is already taken.');
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.username    = username;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

    // =========================================================================
   // LOCAL LOGIN =============================================================
   // =========================================================================

   passport.use('local-login', new LocalStrategy({
       passReqToCallback : true // allows us to pass back the entire request to the callback
   },
   function(req, username, password, done) { // callback with username and password from our form
       // find a user whose username is the same as the forms username
       // we are checking to see if the user trying to login already exists
       User.findOne({ 'local.username' :  username }, function(err, user) {
           // if there are any errors, return the error before anything else
           if (err)
               return done(err);

           // if no user is found, return the message
           //note 3rd argument goes back to route as the "info" field which I then use in my modals
           if (!user)
               return done(null, false, 'No user found!');

           // if the user is found but the password is wrong
           if (!user.validPassword(password))
               return done(null, false, 'Wrong password!');

           // all is well, return successful user
           return done(null, user);
       });

   }));


   // =========================================================================
  // Password change =============================================================
  // =========================================================================

  passport.use('local-passchange', new LocalStrategy({
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form
      //req.body here will have 3rd property which is the new password, the other properties will go to username
      //and password as usual

      User.findOne({ 'local.username' :  username }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          //no need to check for no user since if in current profile page must already be necessarily
          //logged in

          // if the old password is wrong then abort
          if (!user.validPassword(password)){
            return done(null, user, 'Your old password is wrong - Not Updated!');
          }
          //create a new has
          let newHash = User().generateHash(req.body.newPassword)
          //set an update query with new hash
          let update = { '$set': {local:{username:user.local.username,password: newHash}}}
          //use the user Id to update
          User.findByIdAndUpdate(user._id, update, function(err, user){
              if(err){
                console.log("error updating")
                throw err;
              }
          })
          // all is well, return successful password change
          return done(null, user,'Password Changed!');
      });
  }));
};
