var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

// Connect to DB
mongoose.connect('mongodb://ali:admin90@ds251223.mlab.com:51223/fikracmpdb', { useNewUrlParser: true})
let db = mongoose.connection;

//  User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String 
    },
    name: {
        type: String 
    },
    profileimage: {
        type: String 
    }
})

let User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback)
}

module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username}
    User.findOne(query, callback)
}

module.exports.comparePassword = (loginPassword, hash, callback) => {
    bcrypt.compare(loginPassword, hash, (err, isMatch) => {
        callback(null, isMatch)
    })
}

// Export a function to create a new user
module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in DB.
            newUser.password = hash
            newUser.save(callback)
        });
    });
}