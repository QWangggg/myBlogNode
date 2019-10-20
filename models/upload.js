var Multer = require('multer'); // 处理multipart / form-data的node.js中间件，主要用于上传文件

var Upload = function() {

}

var Storage = Multer.diskStorage({
    // 设置图片存储
    // 路径设置为字符串，不no such file or directory报错
    // 设置为destination: function(){...path}则会报错
    destination: '../public/uploads',
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

var multer = Multer({ storage: Storage }).array("image", 3); // 创建multer对象，filed name and max count


Upload.save = function(req, res, callback) {
    multer(req, res, function(err) {
        if (err) {
            console.log(err)
            return callback("Something went wrong!");
        }
        return callback("File uploaded sucessfully!.");
    });
}

module.exports = Upload;