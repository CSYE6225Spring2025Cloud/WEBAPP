const express = require('express');
const bodyParser = require('body-parser');
const healthRoutes = require('./routes/healthRoutes');
const fileRoutes = require('./routes/fileRoutes'); // Import file routes

const app = express();
const logger = require('./logger');

app.use(bodyParser.json());
app.use('/healthz',healthRoutes);
app.use('/', fileRoutes); // Register new file routes

// cicd
const cicdRoutes = require('./routes/cicdRoutes');
app.use('/', cicdRoutes);


app.use((err,req,res,next) =>{
    if(err instanceof SyntaxError && err.status ===400 && 'body' in err){
        console.error('Invalid json or Syntax not correct of json');
        return res.status(400).send();
    }
});

app.use((req, res) => {
    res.status(404) // 404 Not Found
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
        .set('X-Content-Type-Options', 'nosniff')
        .set('Content-Length', '0') // Explicitly set Content-Length to 0
        .send(); // Send empty response
    });

    

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});


module.exports = app;
