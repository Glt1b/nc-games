const db  = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        
        return result.rows;
        
    })
};

exports.selectReviews = () => {
    return db.query(`SELECT * FROM reviews;`).then((result) => {
        return result.rows;
    })
};

exports.getReviewsVotes = () => {
    return db.query(`SELECT * FROM comments;`).then((result) => {
            return result.rows;
        })
};

