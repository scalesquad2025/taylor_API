const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/sdc2025');


const featuresSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  productId: { type: String, required: true, ref: 'Product' },
  feature: {type: String, required: true},
  value: {type: String, required: true}
}, { collection: 'Features' })

const photosSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  styleId: {type: String, required: true, ref: 'Style'},
  thumbnail_url: {type: String, required: true},
  url: {type: String, required: true}
}, { collection: 'Photos' })

const skusSchema = new mongoose.Schema({
  styleId: { type: String, required: true, ref: 'Style' },
  id: {type: Number, required: true},
  quantity: { type: Number, required: true },
  size: { type: String, required: true }
}, { collection: 'SKUs' })

const stylesSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  productId: { type: String, required: true, ref: 'Product' },
  name: String,
  original_price: String,
  sale_price: {type: String, default: null},
  default: String,
  // photos
  // skus
}, { collection: 'Styles' })

const relatedSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  productId: { type: String, required: true, ref: 'Product' },
  relatedIds: {type: String}
}, { collection: 'Related' })

const productSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  campus: String,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  // features
  // related
  // styles
}, { collection: 'Product' })

const cartSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  user_session: {type: Number, required: true},
  product_id: { type: String, required: true, ref: 'Product' },
  active: String,
}, { collection: 'Cart' })

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