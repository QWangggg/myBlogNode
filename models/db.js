var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/myBlog';
var settings = require('../settings.js')

module.exports = function(fn) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        fn(db);
    });
}