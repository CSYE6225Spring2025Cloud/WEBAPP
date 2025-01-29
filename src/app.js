const express = require('express');
const bodyParser = require('body-parser');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/api', healthRoutes);

app.use((err,req,res,next) =>{
    if(err instanceof SyntaxError && err.status ===400 && 'body' in err){
        console.error('Invalid json or Syntax not correct of json');
        return res.status(400).send();
    }
});

module.exports = app;
