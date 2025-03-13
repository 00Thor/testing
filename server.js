require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const helmet = require("helmet");

const { uploadDocument, getAllDocuments, getSpecificDocument, deleteSpecificDocument } = require("./controller/document");
const upload = require("./middleware/multerConfig");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin:"*"})); // Restrict origin in production
app.use(helmet()); // Add security headers

// Static files (uploads and frontend build)
app.use("/uploads", express.static(path.join(__dirname, "uploads"), { maxAge: "1d" }));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build"))); // Serve frontend build
}
// API routes
app.post("/api/upload", upload.single("file"), uploadDocument);
app.get("/api/documents", getAllDocuments);

app.get("/api/documents/:doc_id", getSpecificDocument);
app.delete("/api/delete/:doc_id", deleteSpecificDocument);
//Handle undefined routes
if (process.env.NODE_ENV === 'production') {
  // Redirect HTTP to HTTPS
  app.use((req, res, next) => {
    if (req.protocol === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
