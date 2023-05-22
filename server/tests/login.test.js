import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { Sarah } from "./user.data.js";

// const request = supertest();
const thisDb = db;
let session;

afterAll(async () => {
  await thisDb.close();
});

describe("Test database connection", () => {
  it("should connect to the test database", async () => {
    const res = await testDbConnection();
    expect(res).toBe(true);
  }, 10000);
});

describe("Register and login", () => {
  beforeAll(async () => {
    const status = await thisDb.sync({ force: true });
    expect(status.config.database).toEqual("quizzer_test");
  });

  it("should register user Sarah", async () => {
    const res = await request(app).post("/register").send(Sarah);
    expect(res.statusCode).toEqual(201);
  }, 1000);

  it("should login user Sarah", async () => {
    const res = await request(app).post("/login").send(Sarah);
    session = res.header["set-cookie"];
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should be allowed access to API root", async () => {
    const res = await request(app).get("/api/").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
  });

  it("should log out user Sarah", async () => {
    const res = await request(app).delete("/logout").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
  });

  it("should not be allowed access to API root", async () => {
    const res = await request(app).get("/api/").set("Cookie", session);
    expect(res.statusCode).toEqual(401);
  });
});
