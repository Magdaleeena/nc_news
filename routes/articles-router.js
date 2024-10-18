const articlesRouter = require("express").Router();
const { getArticlesById, getAllArticles, getCommentsByArticleId, createComment, patchArticleVotes } = require("../controllers/news-controllers");

articlesRouter
    .route("/")
    .get(getAllArticles)
    

articlesRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticleVotes)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(createComment)
    

module.exports = articlesRouter;