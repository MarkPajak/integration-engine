var express = require('express');
var router = express.Router();



module.exports = function(passport){

    var isAuthenticated = function (req, res, next) {
            // if user is authenticated in the session, call the next() to call the next request handler 
            // Passport adds this method to request object. A middleware is allowed to add properties to
            // request and response objects
            if (req.isAuthenticated()){
                //console.log(next());
                return next();
            }
           console.log('if the user is not authenticated then redirect him to the login page')
           // res.redirect('/login');
		    return next();
    }


    /* GET login page. */
    router.get('/login!/', function(req, res) {
		
         console.log('Display the Login page with any flash message, if asny')
		 
        res.render('login', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/#!/' + req.body.redirect);
    });
  })(req, res, next);
});

    /* GET Registration Page */
    router.get('/signup', function(req, res){
        res.render('register',{message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash : true  
    }));

    /* GET Home Page when logged in */
    router.get('/', isAuthenticated, function(req, res){
		
        res.render('index', { user: req.user });
    });



    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    return router;
}





