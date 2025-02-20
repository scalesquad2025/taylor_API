const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const db = require('./mongoDB.js');
const readline = require('readline');

const prodArrIds = {};
const cartArrIds = {};
const styleArrIds = {};
const skusArrIds = {};
const photoArrIds = {};
const featuresArrIds = {};
var relatedArrIds = {};


const seedProduct = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/product.csv');
    const stream = fs.createReadStream(filePath);


    const BATCH_SIZE = 30000;
    let batch = [];


    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        const featuresArr = featuresArrIds[row._id];
        const stylesArr = styleArrIds[row._id];
        batch.push({
          _id: row._id,
          campus: "hr-rfp",
          name: row.name,
          slogan: row.slogan,
          description: row.description,
          category: row.category,
          default_price: row.default_price,
          features: featuresArr,
          results: stylesArr,
        });


        if (batch.length === BATCH_SIZE) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {

        if (batch.length > 0) {
          await stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for Product with', batch.length, 'rows');

      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }

      try {
        const productDocs = await db.Product.insertMany(batch);
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}

const seedFeatures = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/features.csv');
    const stream = fs.createReadStream(filePath);

    const BATCH_SIZE = 20000;
    let batch = [];

    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        batch.push({
          _id: row._id,
          productId: row.product_id,
          feature: row.feature,
          value: row.value
        });
        if (batch.length === BATCH_SIZE) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for Features with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        const featureDocs = await db.Features.insertMany(batch);
        await featureDocs.forEach(feature => {
          if (!featuresArrIds[feature.productId]) {
            featuresArrIds[feature.productId] = [];
          }
          featuresArrIds[feature.productId].push(feature._id);
        })
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}

const seedRelated = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/related.csv');
    const stream = fs.createReadStream(filePath);

    const BATCH_SIZE = 20000;
    let batch = [];

    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        if (!relatedArrIds[row.current_product_id]) {
          relatedArrIds[row.current_product_id] = [];
        }
        relatedArrIds[row.current_product_id].push(row.related_product_id);

        if (Object.keys(relatedArrIds).length === BATCH_SIZE) {
          stream.pause();

          for await (var key of Object.keys(relatedArrIds)) {
            batch.push({
              _id: key,
              relatedIds: relatedArrIds[key],
            });
          }

          processBatch(batch)
            .then(() => {
              batch = [];
              relatedArrIds = {};
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for Related with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        const bulkOps = batch.map(doc => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: doc },
            upsert: true
          }
        }));

        await db.Related.bulkWrite(bulkOps);
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}

const seedStyles = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/styles.csv');
    const stream = fs.createReadStream(filePath);

    const BATCH_SIZE = 20000;
    let batch = [];

    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        const skusArr = skusArrIds[row._id];
        const photoArr = photoArrIds[row._id];
        batch.push({
          _id: row._id,
          productId: row.productId,
          name: row.name,
          original_price: row.original_price,
          sale_price: row.sale_price,
          default: row.default_style,
          skus: skusArr,
          photos: photoArr,
        });

        if (batch.length === BATCH_SIZE) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for Styles with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        const styleDocs = await db.Styles.insertMany(batch);
        await styleDocs.forEach(style => {
          if (!styleArrIds[style.productId]) {
            styleArrIds[style.productId] = [];
          }
          styleArrIds[style.productId].push(style._id);
        })
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}

const seedSkus = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/skus.csv');
    const stream = fs.createReadStream(filePath);

    const BATCH_SIZE = 20000;
    let batch = [];

    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        batch.push({
          _id: row._id,
          styleId: row.styleId,
          quantity: row.quantity,
          size: row.size,
        });

        if (batch.length === BATCH_SIZE) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for SKUs with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        const skuDocs = await db.SKUs.insertMany(batch);
        await skuDocs.forEach(skus => {
          if (!skusArrIds[skus.styleId]) {
            skusArrIds[skus.styleId] = [];
          }
          skusArrIds[skus.styleId].push(skus._id);
        })
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}

const seedPhotos = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/photos.csv');
    const stream = fs.createReadStream(filePath);

    const BATCH_SIZE = 20000;
    let batch = [];

    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        batch.push({
          _id: row._id,
          styleId: row.styleId,
          thumbnail_url: row.thumbnail_url,
          url: row.url
        });

        if (batch.length === BATCH_SIZE) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for Photos with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        const photoDocs = await db.Photos.insertMany(batch);
        await photoDocs.forEach(photo => {
          if (!photoArrIds[photo.styleId]) {
            photoArrIds[photo.styleId] = [];
          }
          photoArrIds[photo.styleId].push(photo._id);
        })
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}

const seedCart = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../notes/data/cart.csv');
    const stream = fs.createReadStream(filePath);

    const BATCH_SIZE = 20000;
    let batch = [];

    const parser = parse({
      delimiter: ',',
      comment: '#',
      trim: true,
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    stream
      .pipe(parser)
      .on('data', async (row) => {
        batch.push({
          _id: row._id,
          user_session: row.user_session,
          product_id: row.product_id,
          active: row.active,
        });

        if (batch.length === BATCH_SIZE) {
          stream.pause();
          processBatch(batch)
            .then(() => {
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error processing batch', err);
              stream.resume();
            });
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          processBatch(batch)
          .then(() => {
            batch = [];
            stream.resume();
          })
          .catch((err) => {
            console.error('Error processing batch', err);
            stream.resume();
          });
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch for Cart with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        await db.Cart.insertMany(batch);
        console.log('Batch inserted successfully');
      } catch (err) {
        console.error('Error saving data for product', err);
      }
    }
  })
}


const seedItAll = async () => {
  try {
    await seedPhotos();
    console.log("seeded Photos");

    await seedSkus();
    console.log("seeded SKUs");

    await seedStyles();
    console.log("seeded Styles");

    await seedFeatures();
    console.log("seeded Features");

    await seedProduct();
    console.log("seeded Product");

    await seedRelated();
    console.log("seeded Related");

    await seedCart();
    console.log("seeded Cart");

  } catch (err) {
    console.error("Error occurred during seeding:", err);
  }
  return;
}

seedItAll();