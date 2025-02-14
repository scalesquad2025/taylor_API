const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const db = require('./mongoDB.js');
const readline = require('readline');

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
        batch.push({
          id: row.id,
          campus: "hr-rfp",
          name: row.name,
          slogan: row.slogan,
          description: row.description,
          category: row.category,
          default_price: row.default_price,
        });


        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {

        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');

      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }

      try {
        await db.Product.insertMany(batch);
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
          id: row.id,
          productId: row.product_id,
          feature: row.feature,
          value: row.value
        });

        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        await db.Features.insertMany(batch);
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
        batch.push({
          id: row.id,
          productId: row.current_product_id,
          relatedIds: row.related_product_id,
        });

        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        await db.Related.insertMany(batch);
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
        batch.push({
          id: row.id,
          productId: row.productId,
          name: row.name,
          original_price: row.original_price,
          sale_price: row.sale_price,
          default: row.default_style,
        });

        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        await db.Styles.insertMany(batch);
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
          styleId: row.styleId,
          id: row.id,
          quantity: row.quantity,
          size: row.size,
        });

        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        await db.SKUs.insertMany(batch);
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
          id: row.id,
          styleId: row.styleId,
          thumbnail_url: row.thumbnail_url,
          url: row.url
        });

        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');
      if (batch.length === 0) {
        console.log('Batch is empty');
        return;
      }
      try {
        await db.Photos.insertMany(batch);
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
          id: row.id,
          user_session: row.user_session,
          product_id: row.product_id,
          active: row.active,
        });

        if (batch.length === BATCH_SIZE) {
          console.log(batch.length);
          stream.pause();
          await processBatch(batch);
          batch = [];
          stream.resume();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          stream.pause();
          await processBatch(batch);
          stream.resume();
        }
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
        reject();
      });

    async function processBatch(batch) {
      console.log('Processing batch with', batch.length, 'rows');
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
    await seedProduct();
    console.log("seeded Product");

    await seedFeatures();
    console.log("seeded Features");

    await seedRelated();
    console.log("seeded Related");

    await seedStyles();
    console.log("seeded Styles");

    await seedPhotos();
    console.log("seeded Photos");

    await seedSkus();
    console.log("seeded SKUs");

    await seedCart();
    console.log("seeded Cart");

  } catch (err) {
    console.error("Error occurred during seeding:", err);
  }
}

module.exports = seedItAll;