var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var multer = require('multer')
var upload = multer({dest: './uploads'})

var Book = require('../models/book')

ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } 

  res.redirect('/users/login')
}

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {

  Book.find({}, (err, books)=> {
    if (err) throw err
    let model = {
      title: 'Libarary',
      books: books
    }
    res.render('index', model);
  })
  
});

router.get('/book', (req, res, next) => {
  res.render('book')
})

router.post('/book', (req, res, next) => {
  var title =req.body.title;
  var desc =req.body.desc;
  var author =req.body.author;
  var cover =req.body.cover;

  if(req.file) {
    console.log('File uploaded...')
    var profileimage = req.file.filename
  } else {
    console.log('No File uploaded...')
    var profileimage = 'noimage.jpg'
  }
  
  // form validation
  req.checkBody('title', 'Title is required').notEmpty()
  req.checkBody('desc', 'Description is required').notEmpty()
  req.checkBody('author', 'Author is required').notEmpty()

  // Check errors
  var errors = req.validationErrors()
  
  if (errors) {
    // console.log('errors')
    res.render('book', {
      errors: errors
    })
  } else {
    console.log('no errors')
    let newBook = new Book({
      title: title,
      desc: desc,
      author: author,
      cover: cover
    })

    Book.createBook(newBook, (err, Book) => {
      if (err) throw err
      console.log(Book); 
    })

    // Successful registration message
    req.flash('success', 'Book was add successfully')
  }
  
});

module.exports = router;
