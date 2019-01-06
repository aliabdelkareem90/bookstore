var express = require('express');
var router = express.Router();
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
  res.render('index')
})

router.get('/addbook', (req, res, next) => {
  res.render('addbook')
})

router.post('/addbook', upload.single('cover'), (req, res, next) => {
  var title =req.body.title;
  var desc =req.body.desc;
  var author =req.body.author;

  if(req.file) {
    console.log(req.file.filename)
    var cover = req.file.filename + '.jpg'

  } else {
    console.log('No File uploaded...')
    var cover = 'noimage.jpg'
  }
  
  // form validation
  req.checkBody('title', 'Title is required').notEmpty()
  req.checkBody('desc', 'Description is required').notEmpty()
  req.checkBody('author', 'Author is required').notEmpty()

  // Check errors
  var errors = req.validationErrors()
  
  if (errors) {
    console.log('errors')
    res.render('addbook', {
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

    Book.addBook(newBook, (err, Book) => {
      if (err) throw err
      console.log(Book); 
    })

    // Successful registration message
    req.flash('success', 'Book was add successfully')
  }

  res.location('/addbook')
  res.redirect('/addbook')
});

module.exports = router;
