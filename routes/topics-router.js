const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/news-controllers")

topicsRouter
    .route("/")
    .get(getAllTopics)

module.exports = topicsRouter;