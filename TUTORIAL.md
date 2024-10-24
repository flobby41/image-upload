# Tutorial: Node Image Uploading With Multer

This tutorial provides an end to end walkthrough of uploading images in Node with Multer.

To make things simple I am providing an app-template and complete code.
Feel free to use the template or an app that you are working on.

I am  using [Multer](https://github.com/expressjs/multer) 1.2.0 and Node 6.4.0.

1. Install Multer and Mime and save to dependencies.

   `npm install -S multer`

   `npm install -S mime`

   `npm install -S crypto`

2. Require depencies in route `index.js`

````
var express = require('express'),
    router = express.Router(),
    mime = require('mime'),
    multer = require('multer');
````   

3. Create The Form in `index.ejs`

````
<form action="/upload" method="POST" enctype="multipart/form-data">
  Select an image to upload:
  <input type="file" name="image">
  <input type="submit" value="Upload Image">
</form>
````
The form `enctype` must be `multipart/form-data`, which is the encoding used for forms that upload files. The `enctype` specifies how the form-data is encoded when it is submitted to a server.

When submitted the form will send a POST request to our upload route. Which we will construct in a later step.

4. Before we can write our upload route, we need to configure Multer's storage. Multer ships with two different storage engines, `DiskStorage` and `MemoryStorage`. I will be using `DiskStorage` which gives you full control over storing files to disk.

Create a folder called `uploads` in `public`.

In `index.js` underneath your require statements, write the following.

````
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
````

The two options for `DiskStorage`, `destination` and `filename` are functions that determine where the file should be stored. As their name's suggest, destination determines where the file should be uploaded to and filename determines how the file should be named.

Multer does not provide a file extension, so the filename function must return a filename with an extension. Filename uses `Crypto` to generate a random name and uses `Mime` to determine the correct file extension. Generating a random filename prevents file collisions if you upload two files with the same name. This is not a requirement, but is good practice.

`upload` will be called to upload an image.  

5. Write Upload Route

````
// POST Upload Image
router.post('/upload', upload.single("image"), function(req, res) {
  res.send('<img src="/uploads/' + req.file.filename + '"/>');
});
````
This route first uses Multer to upload the image and then sends a response that includes the image, now hosted on the server.

##Sources

[Multer](https://github.com/expressjs/multer)

[Multer Issue: Files are uploading as 'file without its extension'](https://github.com/expressjs/multer/issues/170)
