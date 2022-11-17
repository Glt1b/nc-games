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

exports.selectReviewById = (review_id) => {
    return db.query(`
        SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then((result) => {
            if (result.rows.length === 0) {
               return Promise.reject({status: 404, msg: `review does not exist for id: ${review_id}`})
            } else {
               return result.rows[0];
        }
        })
       
};


exports.insertComment = (review_id, body) => {

    if(!body.username || !body.body) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    } else {
            return db.query(`
    INSERT INTO comments 
    (author, body, review_id) 
    VALUES 
    ($1, $2, $3)
    RETURNING *;`, [body.username, body.body, review_id]).then((result) => {
        return result.rows[0];
    })
        }
};

exports.setReview= (review_id, body) => {
    if(!body.inc_votes || body.inc_votes === NaN) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    } else {
        return db.query(`
    SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
     .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: `review does not exist for id: ${review_id}`});
        } else {
            return db.query(`
            SELECT votes FROM reviews 
            WHERE review_id = $1;`, [review_id]).then((result) => {
                const newVotes = result.rows[0].votes + body.inc_votes

                return db.query(`
                UPDATE reviews
                SET votes = $1
                WHERE review_id = $2
                RETURNING *;`, [newVotes, review_id])
            }).then((result) => {
                console.log(result.rows[0])

                return result.rows[0];
            })

        }
});
}};


