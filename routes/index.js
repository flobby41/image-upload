var express = require('express'),
    router = express.Router(),
    mime = require('mime'),
    crypto = require('crypto'),
    multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/uploads/')
  },
  filename: function(req, file, cb) {
      crypto.pseudoRandomBytes(16, function(err, raw) {
          cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
});

var upload = multer({
  storage: storage
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Image Upload'
  });
});

// POST Upload Image
router.post('/upload', upload.single("image"), function(req, res) {
  res.send('<img src="/uploads/' + req.file.filename + '"/>');
});

module.exports = router;
