const db = require("../db/connection.js");

exports.fetchAllTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({ rows }) => {
       return rows;
    })
}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT articles.*, 
        COUNT(comments.article_id):: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
    `, [id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found' })
        }
        return rows[0];
    })
}

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
    const validSortBys = ["created_at", "title", "votes", "author", "topic", "article_img_url", "comment_count"];
    const validOrders = ["asc", "desc"];

    if(!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Bad request'})
    }

    if(!validOrders.includes(order)) {
        return Promise.reject({status: 400, msg: 'Invalid order query'})
    }   
   
    let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id):: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;        

    let queryValues = [];

    if(topic) {
        queryString += ` WHERE topic = $1`;
        queryValues.push(topic)
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    return db.query(queryString, queryValues)
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found' })
        }
        return rows;
    })
}

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found' })
        }
        return rows;
    })
}

exports.addComment = (article_id, { body, author }) => {
    return db.query(`INSERT INTO comments (body, author, article_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *`, [body, author, article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found'})
        }
        return rows[0];
    })
}

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`, [inc_votes, article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Article not found'})
        }
       return rows[0];
    })  
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'Comment not found'})
        }
    })
}

exports.fetchAllUsers = () => {
    return db.query(`SELECT username, name, avatar_url FROM users`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'User not found'})
        }
        return rows[0];
    })
}

exports.updateCommentVotes = (comment_id, inc_votes) => {
    return db.query(`UPDATE comments SET votes = votes + $2
        WHERE comment_id = $1
        RETURNING *`, [comment_id, inc_votes])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Comment not found'})
        }
       return rows[0];
    })
}

exports.addArticle = ({ title, topic, author, body, article_img_url }) => { 
    return db.query(`
        INSERT INTO articles (title, topic, author, body, article_img_url, created_at, votes)
        VALUES ($1, $2, $3, $4, $5, NOW(), 0) RETURNING *;`, [title, topic, author, body, article_img_url])
        .then(({ rows }) => {
            const article = rows[0];
            return {
                ...article,
                comment_count: 0, 
            }
    })
}