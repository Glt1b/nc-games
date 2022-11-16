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
    SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
     .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: `review does not exist for id: ${review_id}`});
        } else {
            return db.query(`
    INSERT INTO comments 
    (author, body, review_id, created_at, votes ) 
    VALUES 
    ($1, $2, $3, $4, 0)
    RETURNING *;`, [body.username, body.body, review_id, new Date().toLocaleDateString()]).then((result) => {

        return result.rows[0];
    })
        }
});
}};
