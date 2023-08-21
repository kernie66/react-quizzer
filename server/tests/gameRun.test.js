import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/db/db.config.js";
import { podium, quiz1 } from "./quiz.data.js";
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

  const quiz = await request(app).get("/api/quizzes/1").auth(accessToken, { type: "bearer" });
  res = await request(app)
    .post("/api/games")
    .send(quiz.body[0])
    .auth(accessToken, { type: "bearer" });
  expect(res.statusCode).toEqual(201);
}, 8000);

afterAll(async () => {
  await thisDb.close();
}, 5000);

describe("Run a game", () => {
  it("should start the game", async () => {
    const body = { quizMaster: 1 };
    const res = await request(app)
      .put("/api/games/1/start")
      .send(body)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 started");
  });

  it("should set the game to completed", async () => {
    const res = await request(app)
      .put("/api/games/1/end")
      .send(podium)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 completed");
  });

  it("should not start the same game", async () => {
    const body = { quizMaster: 1 };
    const res = await request(app)
      .put("/api/games/1/start")
      .send(body)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Game with ID 1 is not ready to start");
  });

  it("should restart the same game", async () => {
    const body = {
      quizMaster: 1,
      restart: true,
    };
    const res = await request(app)
      .put("/api/games/1/start")
      .send(body)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 started");
  });
});
