import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { Sarah, Sarah2 } from "./user.data.js";

// const request = supertest();
const thisDb = db;
let accessToken, refreshToken;

afterAll(async () => {
  await thisDb.close();
});

describe("Test database connection", () => {
  it("should connect to the test database", async () => {
    const res = await testDbConnection();
    expect(res).toBe(true);
  }, 5000);
});

describe("Register and login", () => {
  beforeAll(async () => {
    const status = await thisDb.sync({ force: true });
    expect(status.config.database).toEqual("quizzer_test");
  }, 1000);

  it("should register user Sarah", async () => {
    const res = await request(app).post("/api/auth/register").send(Sarah);
    expect(res.statusCode).toEqual(201);
  }, 1000);

  it("should login user Sarah", async () => {
    const res = await request(app).post("/api/auth/login").send(Sarah);
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    expect(res.statusCode).toEqual(200);
    expect(accessToken.length).toEqual(220);
    expect(refreshToken.length).toEqual(163);
  }, 1000);

  it("should be allowed access to API root", async () => {
    const res = await request(app).get("/api/").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should change password for user Sarah", async () => {
    const res = await request(app)
      .put("/api/users/1/password")
      .auth(accessToken, { type: "bearer" })
      .send({ oldPassword: Sarah.password, newPassword: Sarah2.password });
    expect(res.statusCode).toEqual(201);
  });

  it("should log out user Sarah", async () => {
    const res = await request(app).delete("/api/auth/logout").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should not be allowed access to API root when logged out", async () => {
    const res = await request(app).get("/api/").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(401);
  }, 1000);

  it("should login user Sarah with email and new password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: Sarah2.email.toLowerCase(), password: Sarah2.password });
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    expect(res.statusCode).toEqual(200);
    expect(accessToken.length).toEqual(220);
    expect(refreshToken.length).toEqual(163);
  }, 1000);

  // Finally log out Sarah again, which also adds a final delay for the database to clean up
  it("should log out user Sarah again", async () => {
    const res = await request(app).delete("/api/auth/logout").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);
});
