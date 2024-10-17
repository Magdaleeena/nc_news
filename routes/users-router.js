const usersRouter = require("express").Router();
const { getAllUsers } = require("../controllers/news-controllers");

usersRouter
    .route("/")
    .get(getAllUsers)
   
module.exports = usersRouter;