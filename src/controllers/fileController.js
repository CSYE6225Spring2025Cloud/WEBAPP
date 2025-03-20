const AWS = require('aws-sdk');
const { File } = require('../models');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");


// Configure AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION
});

//Ensure `uploadFile` is correctly defined
exports.uploadFile = async (req, res) => {
  try {

    if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0 ) {
      return res.status(400).end();
    }

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileKey = `${uuidv4()}-${req.file.originalname}`;
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    await s3.upload(uploadParams).promise();

    const newFile = await File.create({
      file_name: req.file.originalname,
      fileUrl: fileUrl,
      upload_date: new Date(),
    });
    console.log(newFile.url);
    res.status(201).json({
      file_name: newFile.file_name,
      id: newFile.id,
      url: newFile.fileUrl,
      upload_date: moment(newFile.upload_date).format("YYYY-MM-DD")
    });
  } catch (err) {
    console.error(err);
    res.status(400).send();
  }
};

//Ensure `getFile` is correctly defined
exports.getFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
      return res.status(400).send();
    }

    if (!file) return res.status(404).json({ error: "File not found" });

    res.json({
      file_name: file.file_name,
      id: file.id,
      url: file.fileUrl,
      upload_date: moment(file.upload_date).format("YYYY-MM-DD")
  });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Error retrieving file" });
  }
};

// //Ensure `deleteFile` is correctly defined
// exports.deleteFile = async (req, res) => {
//   try {
//     const file = await File.findByPk(req.params.id);
//     if (!file) return res.status(404).json({ error: "File not found" });

//     await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: file.s3Key }).promise();
//     await file.destroy();

//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error deleting file" });
//   }
// };

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (Object.keys(req.query).length > 0 ) {
      return res.status(400).send();
    }
    // Return 404 Not Found if file does not exist
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    

    // Extract S3 file key from the file URL
    const fileKey = file.fileUrl.split('/').pop();

    // 
    try {
      await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: fileKey }).promise();
    } catch (s3Err) {
      console.error("S3 Deletion Error:", s3Err);
    }

    // Delete the file entry from the database
    try {
      await file.destroy();
    } catch (dbErr) {
      console.error("Database Deletion Error:", dbErr);
      return res.status(400).json({ error: "Failed to delete file from database" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Unexpected Error:", err);

    res.status(400).json({ error: "Bad Request. Could not process file deletion" });
  }
};
