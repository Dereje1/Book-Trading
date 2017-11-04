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
                fullData: req.user
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
    app.post('/signup', passport.authenticate('local-signup'),function(req,res){
      //console.log(res)
      res.redirect('/')
    });
   // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

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
      fullData: null
    });
}
