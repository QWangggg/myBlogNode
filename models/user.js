var mongodb = require('./db');
var crypto = require('crypto') // NODE核心模块，加密密码

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

var getData = function(db, callback) {
    //连接到表 
    var collection = db.db('myBlog').collection('users');
}

// 注册用户
User.prototype.register = function(req, callback) {
    if (req.body.password !== req.body.confirmPassword) {
        // 确认密码是否相同
        callback({
            success: false,
            code: '200',
            data: '请检查两次输入密码是否相同'
        })
        return
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var user = new User(req.body)
    user.password = password
    mongodb(function(db) {
        var collection = db.db('myBlog').collection('users');
        //插入数据
        collection.insertOne(user, function(err, result) {
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
        });
    })
}

// 保存用户信息，先校验是否存在相同用户，再注册
User.prototype.save = function(user, callback) {
    let _this = this
    this.get(user, function(result) {
        if (!result.success) { // 若不存在相同用户名，则注册
            _this.register(user, callback)
        } else { // 若是存在相同用户名，则返回错误
            callback({
                success: false,
                code: '200',
                data: '已存在该用户'
            })
        }
    })
}

// 读取用户信息
User.get = function(req, callback) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    mongodb(function(db) {
        var collection = db.db('myBlog').collection('users');
        collection.findOne({ 'username': req.body.username, 'password': password }, function(err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            let data = {
                success: false,
                code: '200',
                data: '该用户不存在或密码不正确'
            };
            if (result !== null) {
                data.success = true
                data.data = true
            }
            callback(data);
        });
    })
}