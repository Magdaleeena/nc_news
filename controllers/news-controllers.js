const { fetchAllTopics, fetchArticleById} = require("../models/news-models")

exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
    .catch((error) => {
        next(error)
    })

}
exports.getArticlesById = (request, response) => {
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

