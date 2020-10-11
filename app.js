const express = require('express');
const app = express();

const productRoute = require('./api/routes/products');

app.use('/products');

module.exports = app;