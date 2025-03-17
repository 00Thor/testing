// require("dotenv").config(); // Load environment variables
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const path = require("path");
// const helmet = require("helmet");

// const { uploadDocument, getAllDocuments, getSpecificDocument, deleteSpecificDocument, loginAdmin } = require("./controller/document");
// const upload = require("./middleware/multerConfig");

// const app = express();
// const server = http.createServer(app);

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "*" }));
// app.use(helmet()); // Add security headers

// // Static files (uploads and frontend build)
// app.use("/uploads", express.static(path.join(__dirname, "uploads"), { maxAge: "1d" }));
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "frontend", "build"))); // Serve frontend build
// }

// // API routes
// app.post("/api/login", loginAdmin)
// app.post("/api/upload", upload.single("file"), uploadDocument);
// app.get("/api/documents", getAllDocuments);

// app.get("/api/documents/:doc_id", getSpecificDocument);
// app.delete("/api/delete/:doc_id", deleteSpecificDocument);
// // Handle undefined routes
// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === "production") {
//     res.sendFile(path.join(__dirname, "frontend", "build", "index.html")); // Fallback to frontend
//   } else {
//     res.status(404).json({ message: "Not Found" });
//   }
// });

// // Start server
// const PORT = process.env.PORT;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const helmet = require("helmet");

const {
  uploadDocument,
  getAllDocuments,
  getSpecificDocument,
  deleteSpecificDocument,
  loginAdmin,
} = require("./controller/document");
const upload = require("./middleware/multerConfig");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" })); // Adjust CORS origin as needed for production
app.use(helmet()); // Add security headers

// Static files (frontend build)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build"))); // Serve frontend build
}

// API routes
app.post("/api/login", loginAdmin);
app.post("/api/upload", upload.single("file"), uploadDocument);
app.get("/api/documents", getAllDocuments);
app.get("/api/documents/:doc_id", getSpecificDocument);
app.delete("/api/delete/:doc_id", deleteSpecificDocument);

// Handle undefined routes
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html")); // Fallback to frontend
  } else {
    res.status(404).json({ message: "Not Found" });
  }
});

// Start server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
