const multer = require("multer");
const path = require('path');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadFile = {};
uploadFile.csv = multer({ storage: storage });
uploadFile.document = multer({ storage: storage });

module.exports = uploadFile;
