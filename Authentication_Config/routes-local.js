// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will use route middleware to verify this (the isLoggedIn function)
    //wether a user is logged in or not json data will always show up on the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
      let headerObject = req.headers //need for ip
      let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
      ip = (ip === "::1") ? "local" : ip
      res.json({
                authenticated: true,
                userip: ip,
                userName: req.user.local.username,
                userID:req.user._id
            });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    //Since i am not using flash middleware and since I want the messages to directly show up
    //in the react modal on the client side I am using a customized version of authentication
    //this gets the data returned from the strategy to be stored in (err,usr,info) where I have
    //direct access to them
    app.post('/signup', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err);
         }
        if (!user) {
          return res.json({status:'error',message:info});
        }
        else{
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({status:'success',message:user.local.username + " Signed Up!"});
          });
        }
      })(req, res, next);
    });
   // process the login form
   app.post('/login', function(req, res, next) {
     passport.authenticate('local-login', function(err, user, info) {
       if (err) {
         return next(err);
        }
       if (!user) {
         return res.json({status:'error',message:info});
       }
       else{
         req.logIn(user, function(err) {
           if (err) { return next(err); }
           return res.json({status:'success',message:user.local.username + " logged in!!"});
         });
       }
     })(req, res, next);
   });
   //process the password change, notice there is no need to check user info as user must be already logged in
   //to access this path
   app.post('/passchange', function(req, res, next) {
     passport.authenticate('local-passchange', function(err, user, info) {
       if (err) {
         return next(err);
        }

        return res.json({message:info})
     })(req, res, next);
   });
};

// route middleware, the main function that checks if a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't populate the profile page accordingly
    let headerObject = req.headers
     //the x-forwarded-for property of the header does not appear for local host so add an alternative or will
     //error out locally on split to get the ip address the rest of the requests are common to loacl and remote
    let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
    ip = (ip === "::1") ? "local" : ip
    res.json({
      authenticated: false,
      userip: ip,
      userName: null,
      userID:null
    });
}
