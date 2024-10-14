const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

const { getAllTopics, getArticlesById } = require("./controllers/news-controllers")


app.get("/api", (request, response) => {
  response.status(200).send({endpoints})
})

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesById);


app.all("*", (request, response, next) => {
    response.status(404).send({msg: 'Path not found'})
})

app.use((error, request, response, next) => {
    if(error.code === '23502'){
      response.status(400).send({msg: 'Bad request'})
    }
    next(error)
})
  
app.use((error, request, response, next) => {
    if(error.code === '22P02'){
      response.status(400).send({msg: 'Invalid type'})
    }
    next(error)
})
  
app.use((error, request, response, next) => {
    if(error.status && error.msg){
      response.status(error.status).send({msg: error.msg})
    }
    next(error)
})
  
app.use((error, request, response, next) => {
        response.status(500).send({ msg: 'Internal server error' })
      }
)
  
module.exports = app;