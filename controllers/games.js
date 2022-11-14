const { selectCategories } = require('../models/games_models.js');

exports.getCategories = (req, res) => {
    selectCategories().then((result) => {
      
        res.status(200).send({categories: result})
    })
};