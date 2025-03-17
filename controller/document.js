const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // Database connection
const { v4: isUUID } = require("uuid");


// Configuration for uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Upload a documentFITubun
const uploadDocument = async (req, res) => {
  try {
    const { title, description } = req.body;
    const pdf = req.file;

    if (!pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${pdf.filename}`;
    const query = 'INSERT INTO documents (title, file_path, description) VALUES ($1, $2, $3) RETURNING *';
    const values = [title, `uploads/${pdf.filename}`, description];

    const result = await db.query(query, values);

    res.status(201).json({
      doc_id: result.rows[0].doc_id,
      title: title,
      description: description,
      fileUrl: fileUrl, // Return full file URLnp
    });
  } catch (error) {
    console.error('Error uploading document:', error.message);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Get all documents
const getAllDocuments = async (req, res) => {
  try {
    const query = `SELECT * FROM documents`;
    const result = await db.query(query);
    if (result.rows.length === 0) {
        return res.status(204).json({ error: 'No documents found' });
        };
    const documents = result.rows.map((doc) => ({
      doc_id: doc.doc_id,
      title: doc.title,
      description: doc.description,
      fileUrl: `${req.protocol}://${req.get('host')}/${doc.file_path}`,
      uploaded_at: doc.uploaded_at,
    }));

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching PDFs:', error.message);
    res.status(500).json({ error: 'Failed to fetch PDFs.' });
  }
};

// Get a specific PDF by doc_id

const getSpecificDocument = async (req, res) => {
  try {
    const { doc_id } = req.params;

    // Validate input
    if (!doc_id) {
      return res.status(400).json({ error: "Document ID is required." });
    }

    // Query the database for the file path
    const query = "SELECT file_path FROM documents WHERE doc_id = $1";
    const { rows } = await db.query(query, [doc_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Document not found." });
    }

    const filePath = rows[0].file_path;
    const absolutePath = path.join(UPLOADS_DIR, path.basename(filePath));

    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      console.error(`File not found at path: ${absolutePath}`);
      return res.status(404).json({ error: "File not found on the server." });
    }

    // Generate file URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    let fileUrl = `${baseUrl}/${filePath}`;

    // Force HTTPS in production
    if (process.env.NODE_ENV === "production" && req.protocol !== "https") {
      fileUrl = `https://${req.get("host")}/${filePath}`;
    }

    // Respond with the file URL
    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Error fetching the document:", error.message);
    res.status(500).json({ error: "Failed to fetch the document." });
  }
};


// Delete a specific PDF by doc_id
const deleteSpecificDocument = async (req, res) => {
  try {
    const { doc_id } = req.params;

    // Fetch the file path from the database
    const fetchQuery = 'SELECT file_path FROM documents WHERE doc_id = $1';
    const fetchResult = await db.query(fetchQuery, [doc_id]);

    if (fetchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = fetchResult.rows[0].file_path;

    // Ensure the file path is correct
    const absolutePath = path.join(__dirname, '../', filePath);

    // Delete the file from the filesystem
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    } else {
      console.warn(`File not found on the server: ${absolutePath}`);
    }

    // Delete the database entry
    const deleteQuery = 'DELETE FROM documents WHERE doc_id = $1';
    await db.query(deleteQuery, [doc_id]);

    res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Error deleting the PDF:', error.message);
    res.status(500).json({ error: 'Failed to delete the PDF.' });
  }
};

//LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { name, password } = req.body; // Use req.body for POST requests

    // Validate input
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required." });
    }

    // Query to check if the user exists
    const query = `
      SELECT name, password 
      FROM users
      WHERE name = $1 AND password = $2
    `;
    const result = await db.query(query, [name, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid name or password." });
    }

    // Return a success response
    res.status(200).json({
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  loginAdmin,
  uploadDocument,
  getAllDocuments,
  getSpecificDocument,
  deleteSpecificDocument
};