const articlesRouter = require("express").Router();
const { getArticlesById, getAllArticles, getCommentsByArticleId, createComment, patchArticleVotes, postArticle } = require("../controllers/news-controllers");

articlesRouter
    .route("/")
    .get(getAllArticles)
    .post(postArticle)
    

articlesRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticleVotes)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(createComment)
    

module.exports = articlesRouter;