// assets-server.js
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // for handling file uploads
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(`file `, file);
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log(`file2 `, file);
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });
app.get("/api/check", (req, res) => {
  console.log("checked");
  res.status(200).json({
    msg: "its worked!",
  });
});
// Route to handle image uploads
app.post("/api/uploadImage", (req, res) => {
  try {
    if (!req.body.imageData || !req.body.fileName) {
      return res
        .status(400)
        .json({ success: false, error: "No image data or file name provided" });
    }

    const imageData = Buffer.from(req.body.imageData, "base64");
    const fileName = req.body.fileName;

    // Write the image data to a file
    fs.writeFileSync(`uploads/${fileName}`, imageData);

    const url = `http://localhost:${PORT}/uploads/${fileName}`;
    res.json({ success: true, url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`Assets server is running on port ${PORT}`);
});
