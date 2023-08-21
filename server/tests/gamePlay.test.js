import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/db/db.config.js";
import { podium, quiz1 } from "./quiz.data.js";
import { Carl, John, Sarah } from "./user.data.js";
import { questions } from "./question.data.js";
import setupUser from "./helpers/setupUser.js";

// const request = supertest();
const thisDb = db;
let sarahAccessToken, johnAccessToken, carlAccessToken;

beforeAll(async () => {
  let res;

  sarahAccessToken = await setupUser(app, thisDb, Sarah);
  johnAccessToken = await setupUser(app, null, John);
  carlAccessToken = await setupUser(app, null, Carl);

  // Sarah sets up the quiz
  res = await request(app)
    .post("/api/quizzes")
    .send(quiz1)
    .auth(sarahAccessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[0])
    .auth(sarahAccessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);

  res = await request(app)
    .post("/api/quizzes/1/addQuestion")
    .send(questions[1])
    .auth(sarahAccessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);

  const quiz = await request(app).get("/api/quizzes/1").auth(sarahAccessToken, { type: "bearer" });
  res = await request(app)
    .post("/api/games")
    .send(quiz.body[0])
    .auth(sarahAccessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);
}, 8000);

afterAll(async () => {
  await thisDb.close();
}, 5000);

describe("Play a game", () => {
  it("should not find any active games", async () => {
    const res = await request(app).get("/api/play").auth(johnAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("No active game found");
  });

  it("should not connect to any active games", async () => {
    const res = await request(app)
      .get("/api/play/connect")
      .auth(johnAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual("No active game found");
  });

  it("should start the game", async () => {
    const body = { quizMaster: 1 };
    const res = await request(app)
      .put("/api/games/1/start")
      .send(body)
      .auth(sarahAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 started");
  });

  it("John should find the active game", async () => {
    const res = await request(app).get("/api/play").auth(johnAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("John should connect to the active game", async () => {
    const res = await request(app)
      .get("/api/play/connect")
      .auth(johnAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("Carl should find the active game with one player", async () => {
    const res = await request(app).get("/api/play").auth(carlAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
    expect(res.body.players.length).toEqual(1);
  });

  it("Carl should connect to the active game", async () => {
    const res = await request(app)
      .get("/api/play/connect")
      .auth(carlAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("Carl should disconnect from the active game", async () => {
    const res = await request(app)
      .get("/api/play/disconnect")
      .auth(carlAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Player Carl Cole disconnected from game");
  });

  it("Carl should connect to the active game again", async () => {
    const res = await request(app)
      .get("/api/play/connect")
      .auth(carlAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quiz.quizTitle).toEqual("Test Quiz 1");
  });

  it("should get the connected players", async () => {
    const res = await request(app)
      .get("/api/play/players")
      .auth(sarahAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].name).toEqual(John.name);
    expect(res.body[1].name).toEqual(Carl.name);
  });

  it("should set the game to completed", async () => {
    const res = await request(app)
      .put("/api/games/1/end")
      .send(podium)
      .auth(sarahAccessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 completed");
  });
});
