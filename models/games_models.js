const db  = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        
        return result.rows;
        
    })

};

exports.selectReviews = () => {
    return db.query(`
       SELECT * FROM reviews ORDER BY created_at DESC;`).then((result) => {
        return result.rows;
    })
};

exports.getReviewsVotes = () => {
    return db.query(`
        SELECT * FROM comments;`).then((result) => {
            return result.rows;
        })
};

exports.selectCommentsByReviewId = (review_id) => {
    return db.query(
        `SELECT * FROM comments
        WHERE review_id = $1
        ORDER BY created_at ASC;`, [review_id]
    ).then((result) => {
        console.log(result.rows)
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: `Thers is no comment for review id: ${review_id}`})
        } else {
            return result.rows;
        }

        
    })
};



