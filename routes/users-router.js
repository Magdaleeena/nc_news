const usersRouter = require("express").Router();
const { getAllUsers, getUserByUsername } = require("../controllers/news-controllers");

usersRouter
    .route("/")
    .get(getAllUsers)

usersRouter
    .route("/:username")
    .get(getUserByUsername)
   
module.exports = usersRouter;