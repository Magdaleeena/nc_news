const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json")

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