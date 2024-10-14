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

describe("/api/topics", () => {
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