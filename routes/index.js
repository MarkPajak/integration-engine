var express = require('express');
var async = require('async');
var router = express.Router();
var crypto = require('crypto');
var Team = require('../models/user.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var googe_keys=JSON.parse(fs.readFileSync('./secret/google_drive.json').toString());
var bCrypt = require('bcrypt-nodejs');



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
	
	router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
	
   router.get('/music', function(req, res) {
		
         console.log('Display the Login page with any flash message, if asny')
		 
        res.render('music', { message: req.flash('message') });
    });
    /* GET login page. */
    router.get('/login', function(req, res) {
		
         console.log('Display the Login page with any flash message, if asny')
		 
        res.render('login', { message: req.flash('message') });
    });
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
	 
	 
      return res.redirect( "/#"+req.body.redirect);
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
	
	router.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});

router.get('/reset/:token', function(req, res) {
  Team.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});
 // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Team.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = createHash(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
     var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({		  
		
			service: 'gmail',
			auth: {
				user: googe_keys.user,
				pass: googe_keys.password
			}
		}));
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

router.post('/forgot', function(req, res, next) {
	
	
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Team.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({		  
		
			service: 'gmail',
			auth: {
				user: googe_keys.user,
				pass: googe_keys.password
			}
		}));
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

    return router;
}





