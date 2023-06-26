const AWS = require("aws-sdk");
const multer = require("multer");
const express = require("express");

const app = express();
require("dotenv").config();
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

// Handle the file upload route
app.post("/upload", upload.array("files", 10), (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files provided" });
  }

  const s3 = new AWS.S3();
  const uploadPromises = [];

  for (const file of files) {
    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: file.buffer,
    };

    uploadPromises.push(s3.upload(params).promise());
  }

  Promise.all(uploadPromises)
    .then((res) => {
      return res
        .status(200)
        .json({ path: res, message: "Files uploaded successfully" });
    })
    .catch((err) => {
      console.error("Error uploading files:", err);
      return res.status(500).json({ message: "Failed to upload files" });
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
