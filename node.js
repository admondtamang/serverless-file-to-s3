const AWS = require("aws-sdk");
const multer = require("multer");
const express = require("express");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/", storage }); // Destination folder for temporary file storage

// Configure AWS SDK with your desired region
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Define the S3 bucket name
const bucketName = process.env.BUCKET;

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ message: "Failed to upload file" });
    }

    console.log("File uploaded successfully:", data.Location);
    return res.status(200).json({ message: "File uploaded successfully" });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
