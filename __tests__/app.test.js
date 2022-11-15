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

  
  describe('GET/api/review/:review_id/comments', () => {
    test('200 - responds with an array of comments objects', () => {
      return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments.length).toBeGreaterThan(0);
          res.body.comments.forEach((comment) => {
            expect(comment.review_id).toBe(2)
            expect(comment).toMatchObject({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String)
              })
          });
        });
    });

    test('200 - return a message when review id exists but there are no comments', () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([])
        });
    });
  
    test('400 - Bad request when pass invalid id format', () => {
      return request(app)
        .get('/api/reviews/lalala/comments')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual('Bad Request');
        });
    });
  
  
    test('404 - review id not found', () => {
      return request(app)
        .get('/api/reviews/0/comments')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual('Thers is no review id: 0');
        });
    });
  });