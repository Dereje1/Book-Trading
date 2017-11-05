// app/routes.js
module.exports = function(app, passport) {



    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    //wether a user is logged in or not json data will show up on the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
      let headerObject = req.headers //need for ip
      let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
      ip = (ip === "::1") ? "local" : ip
      res.json({
                authenticated: true,
                userip: ip,
                userEmail: req.user.local.email
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
    // LOGIN ===============================
    // =====================================

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.post('/signup', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        console.log(err,user,info)
        if (err) {
          return next(err);
         }
        if (!user) {
          return res.json({status:'error',message:info});
        }
        else{
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({status:'success',message:user.local.email + " Signed Up!"});
          });
        }
      })(req, res, next);
    });
   // process the login form
   app.post('/login', function(req, res, next) {
     passport.authenticate('local-login', function(err, user, info) {
       console.log(err,user,info)
       if (err) {
         return next(err);
        }
       if (!user) {
         return res.json({status:'error',message:info});
       }
       else{
         req.logIn(user, function(err) {
           if (err) { return next(err); }
           return res.json({status:'success',message:user.local.email + " logged in!!"});
         });
       }
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
      userEmail: null
    });
}
