const { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, addComment, updateArticleVotes, removeComment, fetchAllUsers, fetchUserByUsername, updateCommentVotes, addArticle } = require("../models/news-models")

const endpoints = require("../endpoints.json")

exports.getEndpoints = (request, response) => {
    response.status(200).send({ endpoints: endpoints})
}

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
        response.status(200).send({article: articleData})
    })
    .catch(next)
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
        .catch(next)
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
    .catch(next)
}

exports.patchArticleVotes = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;

    updateArticleVotes(article_id, inc_votes)
    .then((updated) => {
        response.status(200).send({ article: updated})
    })
    .catch(next)
}

exports.deleteComment = (request, response, next) => {
    const { comment_id } = request.params;
    removeComment(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch(next)
}

exports.getAllUsers = (request, response, next) => {
    fetchAllUsers()
    .then((users) => {
        response.status(200).send(users)
    })
    .catch(next)
}

exports.getUserByUsername = (request, response, next) => {
    const { username } = request.params;
    fetchUserByUsername(username)
    .then((user) => {
        response.status(200).send({ user })
    })
    .catch(next)
}

exports.patchCommentVotes = (request, response, next) => {
    const { comment_id } = request.params;
    const { inc_votes } = request.body;

    updateCommentVotes(comment_id, inc_votes)
    .then((updatedVotes) => {
        response.status(200).send({ comment: updatedVotes})
    })
    .catch(next)
}

exports.postArticle = (request, response, next) => {
    const { author, title, body, topic, article_img_url } = request.body;

    if (!author || !title || !body || !topic) {
        return response.status(400).send({ msg: "Missing required fields" });
    }
    const defaultImgUrl = "https://images.pexels.com/photos/9809436/pexels-photo-9809436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    const imgUrl = article_img_url || defaultImgUrl;

    const newArticle = {
        author,
        title,
        body,
        topic,
        article_img_url: imgUrl,
    };

    addArticle(newArticle)
        .then((addedArticle) => {
            response.status(201).send({ article: addedArticle })
        })
        .catch(next);
}