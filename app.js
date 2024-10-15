const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

const { psqlErrorHandlerOne, psqlErrorHandlerTwo, customErrorHandler, serverErrorHandler } = require("./error-handlers");
const { getAllTopics, getArticlesById, getAllArticles, getCommentsByArticleId, createComment } = require("./controllers/news-controllers");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({endpoints})
})

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", createComment)

app.all("*", (request, response, next) => {
    response.status(404).send({msg: 'Path not found'})
})

app.use(psqlErrorHandlerOne);
  
app.use(psqlErrorHandlerTwo);
 
app.use(customErrorHandler); 

app.use(serverErrorHandler);
  
module.exports = app;