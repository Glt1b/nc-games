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
    const commentQuery = db.query(
        `SELECT * FROM comments
        WHERE review_id = $1
        ORDER BY created_at ASC;`, [review_id])

    const reviewQuery = db.query(`SELECT * FROM reviews 
                             WHERE review_id = $1;`, [review_id])

    return Promise.all([commentQuery, reviewQuery]).then((results) => {
        const comments = results[0].rows;
        const reviews = results[1].rows;

        if(reviews.length === 0) {
            return Promise.reject({status: 404, msg: `Thers is no review id: ${review_id}`})
        } else {
            return comments;
        }
    })
};


exports.selectUsers = () => {
    return db.query('SELECT * FROM users;').then((result) => {
        return result.rows;
    })
}
