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



  describe('GET/api/users', () => {
    test('200 - responds with an array of user objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
          expect(res.body.users).toBeInstanceOf(Array);
          expect(res.body.users.length).toBeGreaterThan(0);
          res.body.users.forEach((user) => {
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
              })
          });
        })
      })
    })

 
describe('POST api/review/:review_id/comments', () => {
  test('201 - responds with an object of comment when pass valid comment', () => {
    const comment = {username: 'mallionaire', body: 'That is great!'}
    return request(app)
      .post('/api/reviews/2/comments')
      .send(comment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment.body).toEqual('That is great!')
        expect(res.body.comment.author).toEqual('mallionaire')
        expect(res.body.comment).toMatchObject({
          votes: expect.any(Number),
          created_at: expect.any(String)
          })
      });
  });

  test('400 - bad request, review_id does not exist', () => {
    const comment = {username: 'mallionaire', body: 'That is great!'}
    return request(app)
      .post('/api/reviews/0/comments')
      .send(comment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Review id 0 does not exists');
      });
  });


  test('400 - Bad request when pass invalid id format', () => {
    const comment = {username: 'mallionaire', body: 'That is great!'}
    return request(app)
      .post('/api/reviews/lalala/comments')
      .send(comment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request');
      });
  });

  test('400 - Bad request when pass invalid comment object', () => {
    const comment = {body: 'That is great!'}
    return request(app)
      .post('/api/reviews/2/comments')
      .send(comment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request');
      });
  });
});

test('404 - Bad request when username does not exist', () => {
  const comment = {username: 'Marcin', body: 'That is great!'}
  return request(app)
    .post('/api/reviews/2/comments')
    .send(comment)
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toEqual('User Marcin does not exists');
    });

});



  describe('PATCH api/review/:review_id', () => {
    test('201 - responds with an object of updated review when pass valid update object', () => {
      const update = {inc_votes: 5}
      return request(app)
        .patch('/api/reviews/2')
        .send(update)
        .expect(201)
        .then((res) => {
          expect(res.body.review.votes).toEqual(10)
          expect(res.body.review).toMatchObject({
            created_at: expect.any(String),
            category: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            owner: expect.any(String),
            designer: expect.any(String)
            })
        });
    });
  
    test('404 - review id not found', () => {
      const update = {inc_votes: 5}
      return request(app)
        .patch('/api/reviews/0')
        .send(update)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual('review does not exist for id: 0');
        });
    });
  
  
    test('400 - Bad request when pass invalid id format', () => {
      const update = {inc_votes: 5}
      return request(app)
        .patch('/api/reviews/lalala')
        .send(update)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual('Bad Request');
        });
    });
  
    test('400 - Bad request when pass invalid comment object', () => {
      const update = {}
      return request(app)
        .patch('/api/reviews/2')
        .send(update)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual('Bad Request');

        });
    });
  });

