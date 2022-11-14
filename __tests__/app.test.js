const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe('404 code on invalid path request', () => {
    test('404 - responds with 404 code and message Path not found', () => {
      return request(app)
        .get('/api/cate')
        .expect(404)
        .then((res) => {
          
          expect(res.body.msg).toEqual('Path not found');
        });
    });
  });
  

describe('GET/api/categories', () => {
    test('200 - responds with an array of category objects', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res) => {
          
          expect(res.body.categories).toBeInstanceOf(Array);
          expect(res.body.categories.length).toBeGreaterThan(0);
          res.body.categories.forEach((category) => {
            expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
          });
        });
    });
  });
  

  