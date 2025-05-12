const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.trunc(Math.random() * 1000000)}.${file.originalname.split('.')[1]}`)
    }
});

exports.upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }
});