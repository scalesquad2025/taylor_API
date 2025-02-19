const request = require('supertest');
const app = require('../server/index.js');
const { Product, Cart, Styles, SKUs, Photos, Features, Related} = require('../server/mongoDB.js');
const controllers = require('../server/controllers.js');


jest.mock('../server/mongoDB.js');

describe('GET /products', () => {
  it('should return data from /products', async () => {
    const mockData = [
      {
        name: "Camo Onesie",
        slogan: "Blend in to your crowd",
        description: "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
        category: "Jackets",
        default_price: "140"
      }
    ];

    // Mock the find method of the Product model to return mock data
    Product.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      limit: jest.fn().mockReturnThis(), // Return this to allow method chaining
      exec: jest.fn().mockResolvedValue(mockData)  // Return mocked products when exec is called
    });

    // Send a GET request to your Express route
    const response = await request(app).get('/products');

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);  // Ensure the mock data is returned in the response
  });

  it('should handle errors from /products', async () => {
    const mockData = [
      {
        name: "Camo Onesie",
        slogan: "Blend in to your crowd",
        description: "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
        category: "Jackets",
        default_price: "140"
      }
    ];

    // Mock the find method of the Product model to return mock data
    Product.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      limit: jest.fn().mockReturnThis(), // Return this to allow method chaining
      exec: jest.fn().mockRejectedValue(new Error('Database connection error'))  // Return mocked products when exec is called
    });
    // Send a GET request to your Express route
    const response = await request(app).get('/products');

    // Check the response status and body
    expect(response.status).toBe(500);
  });

  it('should return paginated data', async () => {
    const mockData = [
      { name: "Camo Onesie",
        slogan: "Blend in to your crowd",
        description: "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
        category: "Jackets",
        default_price: "140" }
    ];

    Product.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      limit: jest.fn().mockReturnThis(), // Return this to allow method chaining
      exec: jest.fn().mockResolvedValue(mockData)  // Return mocked products when exec is called
    });

    const page = 2;
    const count = 5;
    const response = await request(app).get(`/products?page=${page}&count=${count}`);

    // Check if the status and data match
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);  // Ensure the mock data is returned in the response
  });
});

describe('GET /products/:product_id', () => {
  it('should return data from /products/:product_id', async () => {
    const mockData = {
      name: "Paris Boots",
      slogan: "Dolores et et id est.",
      description: "A hic delectus fugiat odio id aut necessitatibus dolor. Porro quos quaerat accusamus. Architecto totam consectetur est quis voluptatem.",
      category: "Boots",
      default_price: "111",
      features: [
          {
              feature: "Stitching",
              value: "Double Stitch"
          },
          {
              feature: "Frame",
              value: "AllLight Composition Resin"
          }
      ]
  };

    // Mock the find method of the Product model to return mock data
    Product.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockData)  // Return mocked products when exec is called
    });

    // Send a GET request to your Express route
    const response = await request(app).get('/products/22232');

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);  // Ensure the mock data is returned in the response
  });

  it('should handle errors from /products/:product_id', async () => {
    const mockData = {
      name: "Paris Boots",
      slogan: "Dolores et et id est.",
      description: "A hic delectus fugiat odio id aut necessitatibus dolor. Porro quos quaerat accusamus. Architecto totam consectetur est quis voluptatem.",
      category: "Boots",
      default_price: "111",
      features: [
          {
              feature: "Stitching",
              value: "Double Stitch"
          },
          {
              feature: "Frame",
              value: "AllLight Composition Resin"
          }
      ]
  };

    // Mock the find method of the Product model to return mock data
    Product.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('Database connection error'))  // Return mocked products when exec is called
    });
    // Send a GET request to your Express route
    const response = await request(app).get('/products/22232');

    // Check the response status and body
    expect(response.status).toBe(500);
  });
});

describe('GET /products/:product_id/styles', () => {
  it('should return data from /products/:product_id/styles', async () => {
    const mockData = {
      _id: "22232",
      results: [
        {
          _id: "43840",
          name: "Orchid",
          original_price: "111",
          sale_price: "null",
          default: "1",
          photos: [
            {
              thumbnail_url: "https://images.unsplash.com/photo-1522032238811-74bc59578599?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
              url: "https://images.unsplash.com/photo-1422728221357-57980993ea99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=80"
            }
          ],
          skus: [
            {
              _id: "251475",
              quantity: 36,
              size: "12"
            }
          ]
        }
      ]
    }

    // Mock the find method of the Product model to return mock data
    Product.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      lean: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(), // Return this to allow method chaining
      exec: jest.fn().mockResolvedValue(mockData)  // Return mocked products when exec is called
    });

    // Send a GET request to your Express route
    const response = await request(app).get('/products/22232/styles');

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);  // Ensure the mock data is returned in the response
  });

  it('should handle errors from /products/:product_id/styles', async () => {
    const mockData = {
      _id: "22232",
      results: [
        {
          _id: "43840",
          name: "Orchid",
          original_price: "111",
          sale_price: "null",
          default: "1",
          photos: [
            {
              thumbnail_url: "https://images.unsplash.com/photo-1522032238811-74bc59578599?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
              url: "https://images.unsplash.com/photo-1422728221357-57980993ea99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=80"
            }
          ],
          skus: [
            {
              _id: "251475",
              quantity: 36,
              size: "12"
            }
          ]
        }
      ]
    }

    // Mock the find method of the Product model to return mock data
    Product.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      lean: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(), // Return this to allow method chaining
      exec: jest.fn().mockRejectedValue(new Error('Database connection error'))  // Return mocked products when exec is called
    });
    // Send a GET request to your Express route
    const response = await request(app).get('/products/22232/styles');

    // Check the response status and body
    expect(response.status).toBe(500);
  });
});

describe('GET /products/:product_id/related', () => {
  it('should return data from /products/:product_id/related', async () => {
    const mockData = {relatedIds: [
      10166,
      7806,
      4409,
      4902
  ]}

    // Mock the find method of the Product model to return mock data
    Product.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      exec: jest.fn().mockResolvedValue(mockData)  // Return mocked products when exec is called
    });

    // Send a GET request to your Express route
    const response = await request(app).get('/products/22232/related');

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData.relatedIds);  // Ensure the mock data is returned in the response
  });

  it('should handle errors from /products/:product_id/related', async () => {
    const mockData = [
      10166,
      7806,
      4409,
      4902
  ]

    // Mock the find method of the Product model to return mock data
    Product.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      exec: jest.fn().mockRejectedValue(new Error('Database connection error'))  // Return mocked products when exec is called
    });
    // Send a GET request to your Express route
    const response = await request(app).get('/products/22232/related');

    // Check the response status and body
    expect(response.status).toBe(500);
  });
});

describe('GET /cart', () => {
  it('should return data from /cart', async () => {
    const mockData = [{
      user_session: 1234,
      product_id: 1,
      active: "1"
      }]

    // Mock the find method of the Product model to return mock data
    Product.find.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      exec: jest.fn().mockResolvedValue(mockData)  // Return mocked products when exec is called
    });

    // Send a GET request to your Express route
    const response = await request(app).get('/cart');

    // Check the response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);  // Ensure the mock data is returned in the response
  });

  it('should handle errors from /cart', async () => {
    const mockData = [{
      user_session: 1234,
      product_id: 1,
      active: "1"
      }]

    // Mock the find method of the Product model to return mock data
    Product.find.mockReturnValue({
      select: jest.fn().mockReturnThis(),  // Return this to allow method chaining
      exec: jest.fn().mockRejectedValue(new Error('Database connection error'))  // Return mocked products when exec is called
    });
    // Send a GET request to your Express route
    const response = await request(app).get('/cart');

    // Check the response status and body
    expect(response.status).toBe(500);
  });
});

describe('POST /cart', () => {

  it('should send data to /cart', async () => {
    const mockData = [{
      user_session: 1234,
      product_id: 1,
      active: "1"
    }];

    Cart.countDocuments.mockResolvedValue(0);  // Simulate that the count is 0, so the new _id will be 1
    Cart.prototype.save = jest.fn().mockResolvedValue(mockData);  // Mock the save method to resolve with mockData

    // Send a POST request to /cart with mock data (assuming you're adding a product to the cart)
    const response = await request(app)
      .post('/cart')
      .send({ user_session: 1234, product_id: 1, active: "1" });  // Send a sample body for the post

    // Check the response status and body
    expect(response.status).toBe(201);  // Expecting a successful response
  });

  it('should handle errors sending data to /cart', async () => {
    // Mocking Cart.countDocuments and save to simulate a database error
    Cart.countDocuments.mockResolvedValue(0);
    Cart.prototype.save = jest.fn().mockRejectedValue(new Error('Database connection error'));

    // Send a POST request to /cart with mock data
    const response = await request(app)
      .post('/cart')
      .send({ user_session: 1234, product_id: 1, active: "1" });

    // Check the response status for failure
    expect(response.status).toBe(500);  // Expecting 500 Internal Server Error for failure
  });
});