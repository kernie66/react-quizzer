import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { quiz1 } from "./quiz.data.js";

// const request = supertest();
const thisDb = db;

describe("Test database connection", () => {
  it("should connect to the test database", async () => {
    const res = await testDbConnection();
    expect(res).toBe(true);
  });
});

describe("Quiz API", () => {
  beforeAll(async () => {
    await thisDb.sync({ force: true });
    const userData = {
      name: "Sarah",
      email: "Sarah@example.com",
      username: "sarah",
      password: "sarah",
    };
    let res = await request(app).post("/register").send(userData);
    expect(res.statusCode).toEqual(201);
    const loginData = {
      username: "sarah",
      password: "sarah",
    };
    res = await request(app).post("/login").send(loginData);
    console.log(res.text);
    expect(res.statusCode).toEqual(200);
  });

  it("should create one quiz", async () => {
    const res = await request(app).post("/api/quiz").send(quiz1);
    expect(res.statusCode).toEqual(201);
  }, 1000);

  afterAll(async () => {
    thisDb.close();
  });
});
