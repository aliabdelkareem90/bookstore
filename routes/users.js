var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var multer = require('multer')
var upload = multer({dest: './uploads'})

// Bring user model
var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user register. */
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.post('/register', upload.single('profileimage'),function(req, res, next) {
  var name =req.body.name;
  var email =req.body.email;
  var username =req.body.username;
  var password =req.body.password;
  var password2 =req.body.password2;

  if(req.file) {
    console.log('File uploaded...')
    var profileimage = req.file.filename
  } else {
    console.log('No File uploaded...')
    var profileimage = 'noimage.jpg'
  }
  
  // form validation
  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('password2', 'Password do not match').equals(req.body.password)

  // Check errors
  var errors = req.validationErrors()
  
  if (errors) {
    // console.log('errors')
    res.render('register', {
      errors: errors
    })
  } else {
    // console.log('no errors')
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    })

    User.createUser(newUser, (err, user) => {
      if (err) throw err
      console.log(user); 
    })

    // Successful registration message
    req.flash('success', 'You are now registered')

    // redirect to home page after successful registration
    res.location('/')
    res.redirect('/')
  }
  
});

/* GET user login. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

/* POST user login. */
router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in')
    res.redirect('/')
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err
    if (!user) {
      return done(null, false, {message: 'Unknown user'})
    }
    // Compare password
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) return done(err)
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, {message: 'Invalid password'})
      }
    })
  })
}))

// Logout
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success', 'You are now logged out')
  res.redirect('/users/login')
})

module.exports = router;
