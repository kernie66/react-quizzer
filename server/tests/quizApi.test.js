import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { quiz1 } from "./quiz.data.js";
import { Sarah } from "./user.data.js";

// const request = supertest();
const thisDb = db;

describe("Test database connection", () => {
  it("should connect to the test database", async () => {
    const res = await testDbConnection();
    expect(res).toBe(true);
  });
});

describe("Quiz API", () => {
  let session;

  beforeAll(async () => {
    const status = await thisDb.sync({ force: true });
    expect(status.config.database).toEqual("quizzer_test");
    let res = await request(app).post("/register").send(Sarah);
    expect(res.statusCode).toEqual(201);
    res = await request(app).post("/login").send(Sarah);
    session = res.header["set-cookie"];
    console.log("Session:", session);
    expect(res.statusCode).toEqual(200);
  });

  it("should create one quiz", async () => {
    const res = await request(app).post("/api/quiz").send(quiz1).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  }, 1000);

  afterAll(async () => {
    await thisDb.close();
  });
});
