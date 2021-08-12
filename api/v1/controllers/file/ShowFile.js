
const express = require('express');
const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const router = express.Router();


const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

    // create a storage to get or file information from html
// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"
          };
          resolve(fileInfo);
        });
      });
    }
  });
  
  ///here is the upload funtion intialized 
  const upload = multer({
    storage
  });


  exports.ShowFile =  async(req, res) => {
    // console.log('id', req.params.filename)
    // console.log('link', MongoLink)
   const file = gfs
     .find({
       filename: req.params.filename
     })
     .toArray((err, files) => {
       if (!files || files.length === 0) {
         return res.status(404).json({
           err: "no files exist"
         });
       }
       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
     });
 };