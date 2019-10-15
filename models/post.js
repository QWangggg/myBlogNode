var mongodb = require('./db');
var moment = require('moment');

function Post(post) {
    this.name = post.name;
    this.title = post.title;
    this.content = post.content;
}

module.exports = Post;

Post.prototype.save = function(callback) {
    var time = moment().format("YYYY-MM-DD HH-mm-ss")
    var post = {
        name: this.name,
        title: this.title,
        content: this.content,
        time: time
    }
    mongodb(function(db) {
        var collection = db.db('myBlog').collection('posts');
        collection.insert(post, function(err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            if (result.result.ok) {
                callback({
                    success: true,
                    code: '200',
                    data: '保存成功'
                })
            }
        })
    })
}

Post.get = function(name, callback) {
    mongodb(function(db) {
        var collection = db.db('myBlog').collection('posts');
        var query = {}
        if (name) {
            query.name = name;
        }
        collection.find(query).sort({
            time: -1
        }).toArray(function(err, list) {
            if (err) {
                return callback(err);
            }
            var data = {
                code: "200",
                success: true,
                data: list
            }
            callback(data);
        })
    })
}