require('dotenv').config();
const express = require('express');
const path = require('path');
//const auth = require('./middleware/authorization.js');
const axios = require('axios');
const controllers = require('./controllers.js');
const app = express();


app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

//app.use('/api', auth);

app.get('/products', (req, res) => {
  controllers.getProducts(req.query.page, req.query.count)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).end();
  })
});

app.get('/products/:product_id', (req, res) => {
  controllers.getOneProduct(req.params.product_id)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).end();
  })
});

app.get('/products/:product_id/related', (req, res) => {
  controllers.getProductRelated(req.params.product_id)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).end();
  })
});

app.get('/products/:product_id/styles', (req, res) => {
  controllers.getProductStyles(req.params.product_id)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).end();
  })
});

app.get('/cart', (req, res) => {
  controllers.getCart()
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).end();
  })
});

app.post('/cart', (req, res) => {
  controllers.postCart(req.body)
  .then(() => {
    res.status(201).send("cart saved successfully");
  })
  .catch((err) => {
    res.status(500).end();
  })
})

app.listen(3000, () => {
  console.log('currently listening on port 3000');
})


module.exports = app