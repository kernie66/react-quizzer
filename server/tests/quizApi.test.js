import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/db/db.config.js";
import { quiz1, quiz2 } from "./quiz.data.js";
import { Sarah } from "./user.data.js";
import { questions } from "./question.data.js";
import setupUser from "./helpers/setupUser.js";

// const request = supertest();
const thisDb = db;
let accessToken;

afterAll(async () => {
  await thisDb.close();
});

describe("Create quizzes", () => {
  beforeAll(async () => {
    accessToken = await setupUser(app, thisDb, Sarah);
  });

  it("should create one quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send(quiz1)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  }, 5000);

  it("should list one quiz", async () => {
    const res = await request(app).get("/api/quizzes").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  }, 1000);

  it("should get the author of the quiz", async () => {
    const res = await request(app)
      .get("/api/quizzes/1/author")
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(Sarah.name);
  }, 1000);

  it("should create another quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send(quiz2)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  }, 5000);

  it("should list two quizzes", async () => {
    const res = await request(app).get("/api/quizzes").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  }, 1000);

  it("should delete one quiz", async () => {
    const res = await request(app).delete("/api/quizzes/1").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should list one quiz with ID 2", async () => {
    const res = await request(app).get("/api/quizzes").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(2);
  }, 1000);
});

describe("Add questions to quiz", () => {
  beforeAll(async () => {
    accessToken = await setupUser(app, thisDb, Sarah);

    const res = await request(app)
      .post("/api/quizzes")
      .send(quiz1)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  }, 5000);

  it("should add a question to a quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[0])
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  }, 2000);

  it("should not add the same question to a quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[0])
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(400);
  }, 2000);

  it("should add another question to a quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[1])
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  }, 2000);
});
