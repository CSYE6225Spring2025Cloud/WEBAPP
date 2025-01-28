const express = require('express');
const bodyParser = require('body-parser');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/api', healthRoutes);

module.exports = app;
