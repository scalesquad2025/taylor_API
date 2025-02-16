require('dotenv').config();
const express = require('express');
const path = require('path');
const auth = require('./middleware/authorization.js');
const axios = require('axios')
const controllers = require('./controllers.js');
const seedItAll = require('./seedProduct.js');
const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
app.use(seedItAll());

// attach auth key to all routes
app.use('/api', auth);

app.get('/products', auth, (req, res) => {
  // console.log('GETTING ALL PRODUCTS');
});

app.get('/products/:id', auth, (req, res) => {
  // console.log('GETTING PRODUCT ID: ', req.params.id);
});

app.get('/products/:id/styles', auth, (req, res) => {
  // console.log('GETTING STYLES: ', req.params.id);
});

app.listen(3000, () => {
  console.log('currently listening on port 3000');
})