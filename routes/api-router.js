const apiRouter = require("express").Router();
const usersRouter = require("./users-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");
const topicsRouter = require("./topics-router.js");
const endpointsRouter = require("./endpoints-router.js");

apiRouter.use("/", endpointsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;