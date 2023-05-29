import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { podium, quiz1, quiz2 } from "./quiz.data.js";
import { Carl, John, Sarah } from "./user.data.js";
import { questions } from "./question.data.js";

// const request = supertest();
const thisDb = db;
let sarahSession, johnSession, carlSession;

beforeAll(async () => {
  const status = await thisDb.sync({ force: true });
  expect(status.config.database).toEqual("quizzer_test");

  let res = await request(app).post("/register").send(Sarah);
  expect(res.statusCode).toEqual(201);

  res = await request(app).post("/login").send(Sarah);
  sarahSession = res.header["set-cookie"];
  expect(res.statusCode).toEqual(200);

  res = await request(app).post("/register").send(John);
  expect(res.statusCode).toEqual(201);

  res = await request(app).post("/login").send(John);
  johnSession = res.header["set-cookie"];
  expect(res.statusCode).toEqual(200);

  res = await request(app).post("/register").send(Carl);
  expect(res.statusCode).toEqual(201);

  res = await request(app).post("/login").send(Carl);
  carlSession = res.header["set-cookie"];
  expect(res.statusCode).toEqual(200);

  // Sarah sets up the quiz
  res = await request(app).post("/api/quizzes").send(quiz1).set("Cookie", sarahSession);
  expect(res.statusCode).toEqual(201);

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[0])
    .set("Cookie", sarahSession);
  expect(res.statusCode).toEqual(201);

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[1])
    .set("Cookie", sarahSession);
  expect(res.statusCode).toEqual(201);

  const quiz = await request(app).get("/api/quizzes/1").set("Cookie", sarahSession);
  res = await request(app).post("/api/games").send(quiz.body[0]).set("Cookie", sarahSession);
  expect(res.statusCode).toEqual(201);
}, 8000);

afterAll(async () => {
  await thisDb.close();
}, 5000);

describe("Play a game", () => {
  it("should not find any active games", async () => {
    const res = await request(app).get("/api/play").set("Cookie", johnSession);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("No active game found");
  });

  it("should not connect to any active games", async () => {
    const res = await request(app).get("/api/play/connect").set("Cookie", johnSession);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("No active game found");
  });

  it("should start the game", async () => {
    const body = { quizMaster: 1 };
    const res = await request(app).put("/api/games/1/start").send(body).set("Cookie", sarahSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 started");
  });

  it("John should find the active game", async () => {
    const res = await request(app).get("/api/play").set("Cookie", johnSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("John should connect to the active game", async () => {
    const res = await request(app).get("/api/play/connect").set("Cookie", johnSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("Carl should find the active game with one player", async () => {
    const res = await request(app).get("/api/play").set("Cookie", carlSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
    expect(res.body.players.length).toEqual(1);
  });

  it("Carl should connect to the active game", async () => {
    const res = await request(app).get("/api/play/connect").set("Cookie", carlSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("Carl should disconnect from the active game", async () => {
    const res = await request(app).get("/api/play/disconnect").set("Cookie", carlSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Player Carl Cole disconnected from game");
  });

  it("Carl should connect to the active game again", async () => {
    const res = await request(app).get("/api/play/connect").set("Cookie", carlSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("should get the connected players", async () => {
    const res = await request(app).get("/api/play/players").set("Cookie", sarahSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].name).toEqual(John.name);
    expect(res.body[1].name).toEqual(Carl.name);
  });

  it("should set the game to completed", async () => {
    const res = await request(app).put("/api/games/1/end").send(podium).set("Cookie", sarahSession);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 completed");
  });
});
