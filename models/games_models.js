const db  = require("../db/connection.js");

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        return result.rows;
    })

};

exports.selectReviews = (sort_by , category, order) => {
    const validSort = ['title', 'designer', 'owner', 'category', 'created_at', 'votes'];
    
    if(!validSort.includes(sort_by)){
        return Promise.reject({status: 400, msg: 'Bad Request'});
    }
    if (order === 'ASC' || order === 'DESC'){

    let queryStr = `SELECT * FROM reviews `;
    const queryValues = [];

    if(category !== null){
        queryStr += `WHERE category = $1 ORDER BY ${sort_by} ${order};`;
        queryValues.push(category.replaceAll('_', ' '));
        
    } else {
        queryStr += `ORDER BY ${sort_by} ${order};`;
        
    }

    return db.query(queryStr, queryValues).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 400, msg: `category ${category} does not exists`})
        }
        return result.rows;
    })
} else {

    return Promise.reject({status: 400, msg: 'invalid order query'})

}
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

    };

    const userQuery = db.query(`SELECT * FROM users WHERE username = $1;`, [body.username]);
    const reviewQuery = db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]);

    return Promise.all([userQuery, reviewQuery]).then((results) => {
        const user = results[0].rows;
        const review = results[1].rows;

        if (user.length === 0){
            return Promise.reject({status: 400, msg: `User ${body.username} does not exists`});
        } else if (review.length === 0) {
            return Promise.reject({status: 404, msg: `Review id ${review_id} does not exists`});
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
    })
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

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;').then((result) => {
        return result.rows;
    })
}

exports.deleteComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id]).then((result) => {
        if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: `comment does not exists for id: ${comment_id}`});
    } else {
        return result;
    }
    })
}
    

