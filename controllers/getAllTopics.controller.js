const fetchAllTopics = require("../models/fetchAllTopics.model");

const getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    })
    .catch((error) => {
        next(error)
    })

}

module.exports = getAllTopics;