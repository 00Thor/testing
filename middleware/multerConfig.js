// const multer = require('multer');
// const path = require('path');

// // Configure storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads')); // Ensure this folder exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// // File filter to allow only PDFsa
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF files are allowed'), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload; // Field name for the file

const multer = require("multer");
const path = require("path");

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only PDF files are allowed"), false); // Reject the file
  }
};

// Multer configuration for memory storage (no disk storage since Azure is used)
const storage = multer.memoryStorage(); // Store files in memory buffer

const upload = multer({ storage, fileFilter });

module.exports = upload;
