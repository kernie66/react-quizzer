import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/db/db.config.js";
import { quiz1 } from "./quiz.data.js";
import { Sarah } from "./user.data.js";
import { questions } from "./question.data.js";
import setupUser from "./helpers/setupUser.js";

// const request = supertest();
const thisDb = db;
let accessToken;

beforeAll(async () => {
  let res;

  accessToken = await setupUser(app, thisDb, Sarah);

  res = await request(app).post("/api/quizzes").send(quiz1).auth(accessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[0])
    .auth(accessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[1])
    .auth(accessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);
}, 5000);

afterAll(async () => {
  await thisDb.close();
});

describe("Create a game", () => {
  let quiz;

  beforeAll(async () => {
    quiz = await request(app).get("/api/quizzes/1").auth(accessToken, { type: "bearer" });
    expect(quiz.statusCode).toEqual(200);
  });

  it("should create one game", async () => {
    const res = await request(app)
      .post("/api/games")
      .send(quiz.body[0])
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  });

  it("should list one game", async () => {
    const res = await request(app).get("/api/games").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  });

  it("should get the quiz for the game", async () => {
    const res = await request(app).get("/api/games/1").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.id).toEqual(1);
    expect(res.body.quiz.quizTitle).toEqual(quiz1.quizTitle);
  });

  it("should get the QuizMaster for the game", async () => {
    const res = await request(app)
      .get("/api/games/1/gameMaster")
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual(Sarah.name);
  });

  it("should get the questions for the game", async () => {
    const res = await request(app)
      .get("/api/games/1/questions")
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].questionText).toEqual(questions[0].questionText);
    expect(res.body[1].questionText).toEqual(questions[1].questionText);
  });
});
