const express = require('express');
const multer = require('multer');
const { uploadFile, getFile, deleteFile } = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }).single('file');
const logger = require('../logger');



const validateFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).send(); // 
    }

    if (!req.file) {
        return res.status(400).send(); // 
    }
      next(); // Proceed to the upload function
    });
};

router.post('/v1/file', validateFileUpload, uploadFile);
router.get('/v1/file/:id', getFile);
router.delete('/v1/file/:id', deleteFile);

router.get('/v1/file', (req, res) => res.status(400).send());
router.delete('/v1/file', (req, res) => res.status(400).send());

const methodNotAllowed = (req, res) => {
        logger.warn(`405 Method Not Allowed - ${req.method} ${req.originalUrl}`);
        res.status(405).end();
};


//Apply 405 for all unsupported methods dynamically
router.all('/v1/file', methodNotAllowed);
router.all('/v1/file/:id', methodNotAllowed);

module.exports = router;
