const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');

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
          res.body.categories.forEach((category) => {
            expect(category).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
          });
        });
    });
  });
  
  describe('GET/api/reviews', () => {
    test('200 - responds with an array of reviews objects', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((res) => {
          
          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews.length).toBeGreaterThan(0);
          res.body.reviews.forEach((review) => {
            expect(review).toMatchObject({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number)
              })
          });
          expect(res.body.reviews).toBeSortedBy('created_at', {
            descending: true
          });
        });
    });
  });

  
describe('GET/api/review/:review_id', () => {
  test('200 - responds with an object of review', () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then((res) => {
  
        expect(res.body.review).toMatchObject({
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number)
          })
      });
  });

  test('400 - Bad request when pass invalid id format', () => {
    return request(app)
      .get('/api/reviews/lalala')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request');
      });
  });


  test('404 - id not found', () => {
    return request(app)
      .get('/api/reviews/0')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('review does not exist for id: 0');
      });
  });
});
