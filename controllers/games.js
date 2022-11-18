
const { selectCategories, selectReviews, getReviewsVotes,
selectReviewById, selectCommentsByReviewId, selectUsers, setReview, 
insertComment, deleteComment  } = require('../models/games_models.js');

const { readFile } = require('fs/promises');


exports.getCategories = (req, res) => {
    selectCategories().then((result) => {
        res.status(200).send({categories: result})
    })
};

exports.getReviews = (req, res, next) => {
    let reviews = [];
    let count = 0;

    let category = null;
    let sort_by = 'created_at';
    let order = 'DESC';
    
    if(req.query.category){
        category = req.query.category
    };

    if(req.query.sort_by){
        sort_by = req.query.sort_by
    };
    
    if(req.query.order){
       order = req.query.order
    };

    selectReviews(sort_by, category, order)
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
    .catch((err) => {
        next(err);
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

exports.updateReview = (req, res, next) => {
    setReview(req.params.review_id, req.body).then((result) => {
        res.status(201).send({review: result})
    })
    .catch((err) => {
        next(err);
    })
};

exports.postComment = (req, res, next) => {
    insertComment(req.params.review_id, req.body).then((result) => {
        res.status(201).send({comment: result})
    })
    .catch((err) => {
        next(err);
    })
};

exports.deleteCommentById = (req, res, next) => {
    deleteComment(req.params.comment_id).then((result) => {
        if(result){
        res.status(204).send()
}})
    .catch((err) => {
        next(err);
    })
};

exports.getApi = (req, res, next) => {
    readFile('./endpoints.json', 'utf-8').then((result) => {
        res.status(200).send({api: result})
    })
    .catch((err) => {
        next(err);
    })
};