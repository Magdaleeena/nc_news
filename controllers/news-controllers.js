const { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId} = require("../models/news-models")

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
            return response.status(404).send({msg: 'Article not found'})
        }
        response.status(200).send({article: articleData})
    })
    .catch((error) => {
        if(error.code === '22P02') {
            return response.status(400).send({msg: 'Invalid article ID'})
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
    .then((article) => {
        if (!article) {
            return response.status(404).send({ msg: 'Article not found' })
        }
        return fetchCommentsByArticleId(article_id)
        })
        .then((comments) => {
            response.status(200).send({ comments }) 
        })
        .catch((error) => {
            if (error.code === '22P02') {
                return response.status(400).send({ msg: 'Invalid article ID' });
            }
            next(error);
        })
}
