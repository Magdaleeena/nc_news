const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json")
require('jest-sorted');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api", () => {
    it("GET:200 - responds with an object detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

describe("GET - /api/topics", () => {
    describe("GET:200 - get all topics successfully", () => {
        it("returns successful 200 status code", () => {
            return request(app)
            .get("/api/topics")
            .then(({ body }) => {
                expect(typeof body).toBe('object')
            })
        })
        it("GET:200 - responds with an array containing topics", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.topics.length).not.toBe(0);
                body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(topic).toHaveProperty("slug")
                })
            })
        })
    })
    describe("Error handling", () => {
        it("GET:404 - responds with an error when an invalid route is accessed", () => {
            return request(app)
            .get("/api/non-existent")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Path not found')
            })
        })
    })
})

describe("GET - /api/articles/:article_id", () => {
    it("GET:200 - responds with an article object containing correct properties", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toHaveProperty('article_id', 1);
            expect(body.article).toHaveProperty('author', expect.any(String));
            expect(body.article).toHaveProperty('title', expect.any(String));
            expect(body.article).toHaveProperty('body', expect.any(String));
            expect(body.article).toHaveProperty('topic', expect.any(String));
            expect(body.article).toHaveProperty('created_at', expect.any(String));
            expect(body.article).toHaveProperty('votes', expect.any(Number));
            expect(body.article).toHaveProperty('article_img_url', expect.any(String));
            expect(body.article).toHaveProperty('comment_count', expect.any(Number));
       })
    })
    describe("Error handling", () => {
    it("GET:404 - responds with en error message for a non-existent article", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found')
        })
    })
    it("GET:400 - responds with an error message for an invalid ID", () => {
        return request(app)
        .get("/api/articles/abcdefg")
        .expect(({ body }) => {
            expect(body.msg).toBe('Invalid type')
        })
    })
    })
})

describe("GET - /api/articles", () => {
    it("GET:200 - responds with an array of articles with the correct properties", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length).not.toBe(0);
            body.articles.forEach(article => {
                expect(article).toHaveProperty('author', expect.any(String));
                expect(article).toHaveProperty('title', expect.any(String));
                expect(article).toHaveProperty('article_id', expect.any(Number));
                expect(article).toHaveProperty('topic', expect.any(String));
                expect(article).toHaveProperty('created_at', expect.any(String));
                expect(article).toHaveProperty('votes', expect.any(Number));
                expect(article).toHaveProperty('article_img_url', expect.any(String));
                expect(article).toHaveProperty('comment_count', expect.any(Number));
                expect(article).not.toHaveProperty('body'); 
            })
        })
    })
    it("GET:200 - responds with articles sorted by created_at in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', { descending: true });
        })
    })
    it("GET:200 - responds with articles sorted by title in ascending order", () => {
        return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('title', { ascending: true });
        })
    })
    it("GET:200 - responds with articles sorted by votes in descending order", () => {
        return request(app)
        .get("/api/articles?sort_by=votes&order=desc")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('votes', { descending: true })
        })
    })
    it("GET:200 - responds with articles sorted by comment_count in default order", () => {
        return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('comment_count', { descending: true })
        })
    })
    it("GET:200 - responds with articles sorted by topics in default order", () => {
        return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('topic', { descending: true })
        })
    })
    it("GET:200 - responds with articles sorted by topics in ascending order", () => {
        return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('topic', { ascending: true })
        })
    })
    describe("Error handling", () => {
        it("GET:400 - returns an error when order is invalid", () => {
            return request(app)
            .get("/api/articles?order=invalid_order")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid order query' })
            })
        })
        it("GET:400 - returns an error when sort_by is invalid", () => {
            return request(app)
            .get("/api/articles?sort_by=invalid_column")
            .expect(({ body }) => {
                expect(body).toEqual({ msg: 'Bad request'})
            })
        })
        it("GET:400 - returns an error for invalid data types", () => {
            return request(app)
            .get("/api/articles?order=invalid_order&sort_by=votes")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid order query' })
            })
        })
        it("GET:404 - returns an error when the topic does not exist", () => {
            return request(app)
            .get("/api/articles?topic=nonexistent_topic")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Not found' });
            }) 
        })
        it("GET:400 - returns an error for invalid topic format", () => {
            return request(app)
            .get("/api/articles?topic=999")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid type')
            })
        })
    })
})

describe("GET - /api/articles/:article_id/comments", () => {
    it("GET:200 - responds with an array of comments for the specified article", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
            body.comments.forEach(comment => {
                    expect(comment).toHaveProperty('comment_id', expect.any(Number));
                    expect(comment).toHaveProperty('votes', expect.any(Number));
                    expect(comment).toHaveProperty('created_at', expect.any(String));
                    expect(comment).toHaveProperty('author', expect.any(String));
                    expect(comment).toHaveProperty('body', expect.any(String));
                    expect(comment).toHaveProperty('article_id', 1)
            })
        })
    })
    describe("Error handling", () => {
        it("GET:400 - responds with an error message for an invalid article ID", () => {
            return request(app)
            .get("/api/articles/invalid_id/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid article ID');
            })
        })
        it("GET:404 - responds with an error message for a non-existent article", () => {
            return request(app)
            .get("/api/articles/999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            })
        })
    })
})

describe("POST - /api/articles/:article_id/comments", () => {
    it("POST:201 - adds a new comment and returns it", () => {
        const newComment = {
            body: "This is so inspiring! Really great article.",
            username: "butter_bridge"
        }
        return request(app)
        .post("/api/articles/1/comments")
        .expect(201)
        .send(newComment)
        .then(({ body }) => {
            expect(body.comment).toEqual(expect.objectContaining({
                body: newComment.body,
                author: newComment.username,
                article_id: 1
            }))
        })
    })
    describe("Error handling", () => {
        it("POST:400 - returns an error when missing fields", () => {
            const invalidComment = {
                body: "I really enjoy reading your articles, your way of thinking is so down to earth."
            }
            return request(app)
            .post("/api/articles/1/comments")
            .expect(400)
            .send(invalidComment)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Missing required fields'})
            })
        })
        it("POST:400 - returns an error when there are no fields", () => {
            const invalidComment = {}
            return request(app)
            .post("/api/articles/1/comments")
            .expect(400)
            .send(invalidComment)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Missing required fields'})
            })
        })
        it("POST:404 - returns an error when article_id does not exists", () => {
            const newComment = {
                body: "This should be a headline!",
                username: "icellusedkars"
            }
            return request(app)
            .post("/api/articles/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Not found' })
            })
        })
        it("POST:400 - returns an error for invalid article_id such as string", () => {
            const newComment = {
                body: "This is so inspiring!",
                username: "butter_bridge"
            }
            return request(app)
            .post("/api/articles/abc/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid type' })
            })
        })
        it("POST:404 - returns an error when username does not exist", () => {
            const newComment = {
                body: "This is so inspiring!",
                username: "non-existent-user"
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Not found' })
            })
        })
    })
})

describe("PATCH - /api/articles/:article_id", () => {
    it("PATCH:200 - updates the article votes and responds with the updated article", () => {
        const newVote = { inc_votes: 1}
        return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toHaveProperty('article_id', 1)
            expect(body.article).toHaveProperty('votes')
        })
    })

    describe("Error handling", () => {
        it("PATCH:400 - return an error when inc_votes is not a number", () => {
        const newVote = { inc_votes: '1'}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid type')
            })
        })
        it("PATCH:400 - responds with an error message for an invalid article_id", () => {
        const newVote = { inc_votes: '5'}
            return request(app)
            .patch("/api/articles/abc")
            .send(newVote)
            .expect(400) 
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid type')
            })  
        })
        it("PATCH:400 - returns an error when required key is missing", () => {
        const newVote = {}
            return request(app)
            .patch("/api/articles/1")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Missing required information'})
            })
        })
        it("PATCH:404 - returns an error when article does not exist", () => {
        const newVote = { inc_votes: 3}
            return request(app)
            .patch("/api/articles/999")
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Article not found' })
            })
        })
    })
})

describe("DELETE - /api/comments/:comment_id", () => {
       it("DELETE:204 - successfully deletes a comment", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })

    describe("Error handling", () => {
        it("DELETE:404 - returns an error when comment_id does not exist", () => {
            return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Comment not found'})
            })
        })
        it("DELETE:400 - returns an error for an invalid comment_id", () => {
            return request(app)
            .delete("/api/comments/abc")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid type'})
            })
        })
    })
})

describe("GET - /api/users", () => {
    it("GET:200 - responds with an array of users", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeInstanceOf(Array)
            expect(body.length).not.toBe(0)
            body.forEach(user => {
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('avatar_url', expect.any(String))
            })
        })
    })
    describe("Error handling", () => {
        it("GET:404 - responds with an error when an invalid route is accessed", () => {
            return request(app)
            .get("/api/isers")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Path not found')
            })
        })
    })
})


