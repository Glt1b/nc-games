const express = require('express');
const cors = require('cors');

const { getCategories, getReviews,
getReviewById, postComment , getCommentsByReviewId, updateReview,
 getUsers, deleteCommentById, getApi } = require('./controllers/games');


app.use(cors());
const app = express();
app.use(express.json());

app.get('/api', getApi)
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
app.get('/api/users', getUsers);
app.patch('/api/reviews/:review_id', updateReview);
app.post('/api/reviews/:review_id/comments', postComment);
app.delete('/api/comments/:comment_id', deleteCommentById);


app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});


app.use((err, req, res, next) => {
  console.log(err)
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    res.status(500).send({ msg: 'Server Error' });
  }
});


module.exports = app;
