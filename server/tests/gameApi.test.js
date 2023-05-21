import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { podium, quiz1, quiz2 } from "./quiz.data.js";
import { Sarah } from "./user.data.js";
import { questions } from "./question.data.js";

// const request = supertest();
const thisDb = db;
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

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[1])
    .set("Cookie", session);
  expect(res.statusCode).toEqual(201);
}, 5000);

afterAll(async () => {
  await thisDb.close();
});

describe("Create a game", () => {
  let quiz;

  beforeAll(async () => {
    quiz = await request(app).get("/api/quizzes/1").set("Cookie", session);
    expect(quiz.statusCode).toEqual(200);
  });

  it("should create one game", async () => {
    const res = await request(app).post("/api/games").send(quiz.body[0]).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  });

  it("should list one game", async () => {
    const res = await request(app).get("/api/games").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
  });

  it("should get the quiz for the game", async () => {
    const res = await request(app).get("/api/games/1").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.id).toEqual(1);
    expect(res.body.quiz.quizTitle).toEqual(quiz1.quizTitle);
  });

  it("should get the QuizMaster for the game", async () => {
    const res = await request(app).get("/api/games/1/gameMaster").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual(Sarah.name);
  });

  it("should get the questions for the game", async () => {
    const res = await request(app).get("/api/games/1/questions").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].questionText).toEqual(questions[0].questionText);
    expect(res.body[1].questionText).toEqual(questions[1].questionText);
  });
});
