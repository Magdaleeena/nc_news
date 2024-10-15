const { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, addComment, updateArticleVotes } = require("../models/news-models")

exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
    .catch((error) => {
        next(error)
    })

}
exports.getArticlesById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id)
    .then((articleData) => {
        if(!articleData) {
            response.status(404).send({msg: 'Article not found'})
        }
        response.status(200).send({article: articleData})
    })
    .catch((error) => {
        if(error.code === '22P02') {
            response.status(400).send({msg: 'Invalid article ID'})
        }
        next(error)
    })
}

exports.getAllArticles = (request, response, next) => {
    const { sort_by, order, topic } = request.query;
    fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id)
    .then(() => {
         return fetchCommentsByArticleId(article_id)
        })
        .then((comments) => {
            response.status(200).send({ comments }) 
        })
        .catch((error) => {
            if (error.code === '22P02') {
                response.status(400).send({ msg: 'Invalid article ID' });
            }
            next(error);
        })
}

exports.createComment = (request, response, next) => {
    const { article_id } = request.params;
    const { body, username } = request.body;

    if(!body || !username) {
        response.status(400).send({ msg: 'Missing required fields'})
    }
        
    addComment(article_id, { body, author: username })
    .then((comment) => {
        response.status(201).send({ comment})
    })
    .catch((error) => {
        if (error.code === '23503') {
            response.status(404).send({ msg: 'Article not found' });
        }
        next(error);
    })
}

exports.patchArticleVotes = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;

     if(typeof inc_votes !== 'number'){
        return next({ status: 400, msg: 'Invalid type'})
    }

    updateArticleVotes(article_id, inc_votes)
    .then((updated) => {
        response.status(200).send({ article: updated})
    })
    .catch(next);
}
