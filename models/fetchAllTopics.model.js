const db = require("../db/connection.js");

const fetchAllTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({ rows }) => {
       return rows;
    })
}

module.exports = fetchAllTopics;