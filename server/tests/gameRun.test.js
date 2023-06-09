import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/db/db.config.js";
import { podium, quiz1 } from "./quiz.data.js";
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

  const quiz = await request(app).get("/api/quizzes/1").set("Cookie", session);
  res = await request(app).post("/api/games").send(quiz.body[0]).set("Cookie", session);
  expect(res.statusCode).toEqual(201);
}, 8000);

afterAll(async () => {
  await thisDb.close();
}, 5000);

describe("Run a game", () => {
  it("should start the game", async () => {
    const body = { quizMaster: 1 };
    const res = await request(app).put("/api/games/1/start").send(body).set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 started");
  });

  it("should set the game to completed", async () => {
    const res = await request(app).put("/api/games/1/end").send(podium).set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 completed");
  });

  it("should not start the same game", async () => {
    const body = { quizMaster: 1 };
    const res = await request(app).put("/api/games/1/start").send(body).set("Cookie", session);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Game with ID 1 is not ready to start");
  });

  it("should restart the same game", async () => {
    const body = {
      quizMaster: 1,
      restart: true,
    };
    const res = await request(app).put("/api/games/1/start").send(body).set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual("Game with ID 1 started");
  });
});
