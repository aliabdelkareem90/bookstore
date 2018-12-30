var mongoose = require('mongoose')

mongoose.connect('mongodb://ali:admin90@ds251223.mlab.com:51223/fikracmpdb', { useNewUrlParser: true})
let db = mongoose.connection;

let bookSchema = mongoose.Schema({
    title: String,
    desc: String,
    author: String,
    cover: String
})

let Book = module.exports = mongoose.model('Book', bookSchema)

module.exports.addBook = (newBook, callback) => {
    newBook.save(callback)
}