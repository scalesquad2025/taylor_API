const mongoose = require('mongoose');
const { Product, Cart, Styles, SKUs, Photos, Features, Related} = require('./mongoDB.js');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://3.144.110.212:27017/sdc2025', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

connectDB();

module.exports = {

  getProducts : (page = 1, count = 5) => {
    return new Promise(async (resolve, reject) => {
      try {

        const skip = (page - 1) * count;

        const products = await Product.find()
        .skip(skip)
        .select('-created_at -__v -_id -updated_at -campus -features -related -styles -results')
        .limit(count)
        .exec();
        resolve(products);
      } catch (err) {
        console.error('Error fetching paginated documents:', err);
        reject(err);
      }
    })
  },

  getOneProduct : (product_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await Product.findOne({_id: product_id})
        .select('-created_at -__v -_id -updated_at -campus -results')
        .populate({
          path: 'features',
          select: 'feature value -_id ',
          model: 'Features'
          })
        .exec();
        resolve(product);
      } catch (err) {
        console.error('Error fetching paginated documents:', err);
        reject(err);
      }
    })
  },

  getProductStyles : (product_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await Product.findOne({_id: product_id})
        .select('_id')
        .lean()
        .populate({
          path: 'results',
          select: '-__v -productId',
          populate: [{
            path: 'photos',
            select: '-styleId -_id -__v',
            model: 'Photos'
          },
          {
            path: 'skus',
            select: '_id -styleId -__v',
            model: 'SKUs'
          }]
        })
        .exec();
        resolve(product);
      } catch (err) {
        console.error('Error fetching paginated documents:', err);
        reject(err);
      }
    })
  },

  getProductRelated : (product_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const related = await Related.findOne({_id: product_id})
        .select('relatedIds -_id')
        .exec();
        resolve(related.relatedIds);
      } catch (err) {
        console.error('Error fetching paginated documents:', err);
        reject(err);
      }
    })
  },

  getCart : () => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.find({})
        .select('-_id -__v')
        .exec();
        resolve(cart);
      } catch (err) {
        console.error('Error fetching paginated documents:', err);
        reject(err);
      }
    })
  },

  postCart : (cart_data) => {
    return new Promise(async (resolve, reject) => {
      const count = await Cart.countDocuments();
      var newCart = new Cart({
        _id: (count + 1),
        user_session: cart_data.user_session,
        product_id: cart_data.product_id,
        active: cart_data.active,
      })

      newCart.save()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log('error saving cart:', err);
        reject(err);
      })
    })
  },
}