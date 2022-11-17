
const { selectCategories, selectReviews, getReviewsVotes,
selectReviewById, selectCommentsByReviewId, selectUsers } = require('../models/games_models.js');

exports.getCategories = (req, res) => {
    selectCategories().then((result) => {
        res.status(200).send({categories: result})
    })
};

exports.getReviews = (req, res) => {
    let reviews = [];
    let count = 0;
    selectReviews()
    .then((result) => {
        reviews = result;
    }).then(() => {
        getReviewsVotes()
        .then((result) => {
            
            for ( let review of reviews ) {
                const comment_count = result.filter((item) => item.review_id === review.review_id).length;
                review['comment_count'] = comment_count;
                count++;
                if (reviews.length === count){
                    res.status(200).send({reviews: reviews})
                }
            }
            

        })
    })
};

exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.review_id).then((result) => {
        res.status(200).send({review: result})
    })
    .catch((err) => {
        next(err);
    })

};

exports.getCommentsByReviewId = (req, res, next) => {
    selectCommentsByReviewId(req.params.review_id).then((result) => {
        res.status(200).send({comments: result})
    })
    .catch((err) => {
        next(err);
    })

};

exports.getUsers = (req, res) => {
    selectUsers().then((result) => {
        res.status(200).send({users: result})
    })
};