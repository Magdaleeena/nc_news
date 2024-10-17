const endpointsRouter = require('express').Router();
const { getEndpoints } = require("../controllers/news-controllers");

endpointsRouter.get('/', getEndpoints);

module.exports = endpointsRouter;