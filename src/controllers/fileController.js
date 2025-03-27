const AWS = require('aws-sdk');
const { File } = require('../models');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const logger = require('../logger');
const StatsD = require('statsd-client');
const statsd = new StatsD({ host: 'localhost', port: 8125, prefix: 'webapp' });


// Configure AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION
});

//Ensure `uploadFile` is correctly defined
exports.uploadFile = async (req, res) => {
  const start = Date.now();
  statsd.increment('api.uploadFile.count');

  try {
    logger.info("POST /file - uploadFile called");

    if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
      logger.warn("uploadFile - Unexpected query or path params");
      return res.status(400).end();
    }

    if (!req.file) {
      logger.warn("uploadFile - No file uploaded");
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileKey = `${uuidv4()}-${req.file.originalname}`;
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    const s3Start = Date.now();
    await s3.upload(uploadParams).promise();
    const s3Time = Date.now() - s3Start;
    logger.info(`S3 Upload Time: ${s3Time}ms`);
    statsd.timing('s3.uploadFile.duration', s3Time);

    const dbStart = Date.now();
    const newFile = await File.create({
      file_name: req.file.originalname,
      fileUrl: fileUrl,
      upload_date: new Date(),
    });
    const dbTime = Date.now() - dbStart;
    logger.info(`DB Insert Time: ${dbTime}ms`);
    statsd.timing('db.uploadFile.insert.duration', dbTime);

    res.status(201).json({
      file_name: newFile.file_name,
      id: newFile.id,
      url: newFile.fileUrl,
      upload_date: moment(newFile.upload_date).format("YYYY-MM-DD")
    });

  } catch (err) {
    logger.error(`uploadFile - 400 Bad Request Error: ${err.message}\n${err.stack}`);
    res.status(400).send();
  } finally {
    const total = Date.now() - start;
    logger.info(`uploadFile Total Time: ${total}ms`);
    statsd.timing('api.uploadFile.total.duration', total);
  }
};



//Ensure `getFile` is correctly defined
exports.getFile = async (req, res) => {
  const start = Date.now();
  statsd.increment('api.getFile.count');

  try {
    logger.info("GET /file/:id - getFile called");

    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
      logger.warn("getFile - Unexpected query or body");
      return res.status(400).send();
    }

    const dbStart = Date.now();
    const file = await File.findByPk(req.params.id);
    const dbTime = Date.now() - dbStart;
    logger.info(`DB Query Time: ${dbTime}ms`);
    statsd.timing('db.getFile.query.duration', dbTime);

    if (!file) {
      logger.warn("getFile - File not found");
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      file_name: file.file_name,
      id: file.id,
      url: file.fileUrl,
      upload_date: moment(file.upload_date).format("YYYY-MM-DD")
    });

  } catch (err) {
    logger.error(`getFile Error: ${err.message}\n${err.stack}`);
    res.status(404).json({ error: "Error retrieving file" });

    
  } finally {
    const total = Date.now() - start;
    logger.info(`getFile Total Time: ${total}ms`);
    statsd.timing('api.getFile.total.duration', total);
  }
};

exports.deleteFile = async (req, res) => {
  const start = Date.now();
  statsd.increment('api.deleteFile.count');

  try {
    logger.info("DELETE /file/:id - deleteFile called");

    const file = await File.findByPk(req.params.id);
    if (Object.keys(req.query).length > 0) {
      logger.warn("deleteFile - Unexpected query params");
      return res.status(400).send();
    }

    if (!file) {
      logger.warn("deleteFile - File not found");
      return res.status(404).json({ error: "File not found" });
    }

    const fileKey = file.fileUrl.split('/').pop();

    try {
      const s3Start = Date.now();
      await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: fileKey }).promise();
      const s3Time = Date.now() - s3Start;
      logger.info(`S3 Deletion Time: ${s3Time}ms`);
      statsd.timing('s3.deleteFile.duration', s3Time);
    } catch (s3Err) {
      logger.error("S3 Deletion Error:", s3Err);
    }

    try {
      const dbStart = Date.now();
      await file.destroy();
      const dbTime = Date.now() - dbStart;
      logger.info(`DB Delete Time: ${dbTime}ms`);
      statsd.timing('db.deleteFile.delete.duration', dbTime);
    } catch (dbErr) {
      logger.error("Database Deletion Error:", dbErr);
      return res.status(400).json({ error: "Failed to delete file from database" });
    }

    res.status(204).send();

  } catch (err) {
    logger.error("Unexpected Error:", err);
    res.status(400).json({ error: "Bad Request. Could not process file deletion" });
  } finally {
    const total = Date.now() - start;
    logger.info(`deleteFile Total Time: ${total}ms`);
    statsd.timing('api.deleteFile.total.duration', total);
  }
};
