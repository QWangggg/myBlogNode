var express = require('express');
var router = express.Router();
var crypto = require('crypto'), // NODE核心模块，加密密码
    User = require('../models/user.js')
Post = require('../models/post.js')
Upload = require('../models/upload')

/* GET home page. */
router.get('/auth/menu', function(req, res) { // 获取菜单
    if (!req.cookies.username) {
        res.send({
            success: true,
            code: '200',
            data: {
                menus: [{ name: "HOME" }, { name: "LOGIN" }, { name: "REGISTER" }]
            }
        })
    } else {
        res.send({
            success: true,
            code: '200',
            data: {
                username: req.cookies.username,
                menus: [{ name: "HOME" }, { name: "POST" }, { name: "REGISTER" }]
            }
        })
    }
});

router.post('/auth/register', (req, res) => { // 注册
    var user = new User(req.body)
    user.save(req, function(result) {
        res.send(result)
    })
})

router.post('/auth/login', (req, res) => { // 登录
    User.get(req, function(result) {
        res.cookie('username', req.body.username, { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.send(result)
    })
})

router.get('/auth/articles', (req, res) => { // 获取文章
    Post.getAll(req.cookies.username, (result) => {
        res.send(result)
    })
})

router.get('/auth/article:id', (req, res) => { // 获取单篇文章
    Post.getOne(req.params.id, (result) => {
        if (result.success) {
            res.status(200).send(result)
        } else {
            res.send(result)
        }
    })
})

router.post('/post', (req, res) => { // 发表文章
    var post = new Post(req.body)
    post.save((result) => {
        res.send(result)
    })
})

router.get('/logout', (req, res) => {})

router.post('/upload', (req, res) => { // 发表文章
    Upload.save(req, res, (result) => {
        if (result.success) {
            res.status(200).send(result)
        } else {
            res.status(100001).send(result)
        }
    })
})

module.exports = function(app) {
    app.use('/', router)
};