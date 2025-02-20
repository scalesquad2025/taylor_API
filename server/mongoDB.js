const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://3.144.110.212:27017/sdc2025');
//mongosh 3.144.110.212:27017
const featuresSchema = new mongoose.Schema({
  _id: {type: String, required:true},
  productId: {type: String, required: true},
  feature: {type: String, required: true},
  value: {type: String, required: true}
}, { collection: 'Features' })

const photosSchema = new mongoose.Schema({
  _id: {type: String, required:true},
  styleId: {type: String, required: true},
  thumbnail_url: {type: String, required: true},
  url: {type: String, required: true}
}, { collection: 'Photos' })

const skusSchema = new mongoose.Schema({
  _id: {type: String, required:true},
  styleId: {type: String, required: true},
  quantity: { type: Number, required: true },
  size: { type: String, required: true }
}, { collection: 'SKUs' })

const stylesSchema = new mongoose.Schema({
  _id: {type: String, required:true},
  productId: {type: String, required: true},
  name: String,
  original_price: String,
  sale_price: {type: String, default: null},
  default: String,
  photos: [{ type: String, ref: 'Photos' }],
  skus: [{ type: String, ref: 'SKUs' }]
}, { collection: 'Styles' })

const relatedSchema = new mongoose.Schema({
  _id: {type: Number, required: true},
  relatedIds: [{ type: Number, ref: 'Product' }]
}, { collection: 'Related' })

const productSchema = new mongoose.Schema({
  _id: {type: String, required:true},
  campus: String,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  features: [{ type: String, ref: 'Features' }],
  results: [{ type: String, ref: 'Styles' }]
}, { collection: 'Product' })

const cartSchema = new mongoose.Schema({
  _id: {type: String, required:true},
  user_session: {type: Number, required: true, index: true},
  product_id: {type: Number, required: true},
  active: String,
},{ collection: 'Cart' })

const Cart = mongoose.model("Cart", cartSchema);
const Product = mongoose.model('Product', productSchema);
const Styles = mongoose.model('Styles', stylesSchema);
const SKUs = mongoose.model('SKUs', skusSchema);
const Photos = mongoose.model('Photos', photosSchema);
const Features = mongoose.model('Features', featuresSchema);
const Related = mongoose.model('Related', relatedSchema);

module.exports = {
  Product, //
  Cart, //
  Styles, //
  SKUs, //
  Photos,//
  Features, //
  Related //
};