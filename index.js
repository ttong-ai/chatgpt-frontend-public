const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'web')

// using the 'body-parser' middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'web')));

// catch all 404 errors and send to 404.html
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'web', '404.html'));
});

//start server on port 3000
app.listen(3000, () => {
  console.log('server started');
});
