"use strict"
require('./middleware/auth.js');
const path = require('path');
const bodyParser = require('body-parser');
const app = require('express')();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/reports'));
app.use(require('./routes/users'));
app.use(require('./routes/auth'));
app.use(require('./routes/index'));

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000/')
});
