const express = require('express');
const { getCategories } = require('./controllers/games');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories)


app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});



module.exports = app;
