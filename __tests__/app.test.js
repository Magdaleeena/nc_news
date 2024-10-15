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
            expect(body.article).toHaveProperty('author');
            expect(body.article).toHaveProperty('title');
            expect(body.article).toHaveProperty('body');
            expect(body.article).toHaveProperty('topic');
            expect(body.article).toHaveProperty('created_at');
            expect(body.article).toHaveProperty('votes');
            expect(body.article).toHaveProperty('article_img_url');
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
            expect(body.msg).toBe('Invalid article ID')
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
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');
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
            });
    })
    describe("Error handling", () => {
        it("GET:400 - returns an error when order is invalid", () => {
            return request(app)
            .get("/api/articles?order=invalid_order")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Invalid order query" })
            })
        })
        it("GET:404 - returns an error when the topic does not exist", () => {
            return request(app)
            .get("/api/articles?topic=nonexistent_topic")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Not found" });
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
    it("POST:200 - adds a new comment and returns it", () => {
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
                expect(body).toEqual({ msg: 'Article not found' })
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
            expect(body.article.votes).toBeGreaterThan(0)
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

