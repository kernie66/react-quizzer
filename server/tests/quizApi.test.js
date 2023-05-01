import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { quiz1, quiz2 } from "./quiz.data.js";
import { Sarah } from "./user.data.js";
import { questions } from "./question.data.js";

// const request = supertest();
const thisDb = db;

describe("Create quizzes", () => {
  let session;

  beforeAll(async () => {
    const status = await thisDb.sync({ force: true });
    expect(status.config.database).toEqual("quizzer_test");

    let res = await request(app).post("/register").send(Sarah);
    expect(res.statusCode).toEqual(201);

    res = await request(app).post("/login").send(Sarah);
    session = res.header["set-cookie"];
    expect(res.statusCode).toEqual(200);
  });

  it("should create one quiz", async () => {
    const res = await request(app).post("/api/quizzes").send(quiz1).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  }, 5000);

  it("should list one quiz", async () => {
    const res = await request(app).get("/api/quizzes").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it("should create another quiz", async () => {
    const res = await request(app).post("/api/quizzes").send(quiz2).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  }, 5000);

  it("should list two quizzes", async () => {
    const res = await request(app).get("/api/quizzes").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });
});

describe("Add questions to quiz", () => {
  let session;

  beforeAll(async () => {
    const status = await thisDb.sync({ force: true });
    expect(status.config.database).toEqual("quizzer_test");

    let res = await request(app).post("/register").send(Sarah);
    expect(res.statusCode).toEqual(201);

    res = await request(app).post("/login").send(Sarah);
    session = res.header["set-cookie"];
    expect(res.statusCode).toEqual(200);

    res = await request(app).post("/api/quizzes").send(quiz1).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  });

  it("should add a question to a quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[0])
      .set("Cookie", session);
    console.log("Question:", questions[0]);
  });

  afterAll(async () => {
    await thisDb.close();
  });
});
