// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');


const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); 
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, 
});


function uploadErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large! Max size is 2MB.' });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}


app.post('/upload', upload.single('resume'), uploadErrorHandler, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a PDF file.' });
  }
  res.json({ message: 'File uploaded successfully!', file: req.file.filename });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
