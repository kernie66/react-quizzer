import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { quiz1, quiz2 } from "./quiz.data.js";
import { Sarah } from "./user.data.js";
import { questions } from "./question.data.js";

// const request = supertest();
const thisDb = db;

describe("Create a game", () => {
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

    res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[0])
      .set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  }, 8000);

  it("should create one game", async () => {
    const quiz = await request(app).get("/api/quizzes/1").set("Cookie", session);
    console.log(quiz.body[0]);
    const res = await request(app).post("/api/games").send(quiz.body[0]).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  });

  it("should list one game", async () => {
    const res = await request(app).get("/api/games").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await thisDb.close();
  });
});
/*
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
    expect(res.statusCode).toEqual(201);
    console.log("Question:", questions[0]);
  }, 2000);

  it("should not add the same question to a quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[0])
      .set("Cookie", session);
    expect(res.statusCode).toEqual(400);
    console.log("Question:", questions[0]);
  }, 2000);

  it("should add another question to a quiz", async () => {
    const res = await request(app)
      .post("/api/quizzes/1/addQuestion")
      .send(questions[1])
      .set("Cookie", session);
    expect(res.statusCode).toEqual(201);
    console.log("Question:", questions[1]);
  }, 2000);

  afterAll(async () => {
    await thisDb.close();
  });
});
*/
