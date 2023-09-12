import request from "supertest";
import { app } from "../src/app.js";
import { db } from "../src/db/db.config.js";
import { John, Sarah } from "./user.data.js";
import setupUser from "./helpers/setupUser.js";

// const request = supertest();
const thisDb = db;
let accessToken;

beforeAll(async () => {
  accessToken = await setupUser(app, thisDb, Sarah);
});

afterAll(async () => {
  await thisDb.close();
});

describe("User API", () => {
  it("should show one user", async () => {
    const res = await request(app).get("/api/users").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].name).toEqual(Sarah.name);
  }, 1000);

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(John)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(201);
  }, 1000);

  it("should show two users", async () => {
    const res = await request(app).get("/api/users").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].email).toEqual(Sarah.email.toLowerCase());
    expect(res.body[0].name).toEqual(Sarah.name);
    expect(res.body[0].avatarUrl).toEqual(Sarah.avatarUrl);
    expect(res.body[1].id).toEqual(2);
    expect(res.body[1].username).toEqual(John.username);
    expect(res.body[1].email).toEqual(John.email);
    expect(res.body[1].name).toEqual(John.name);
    expect(res.body[1].nicknames).toContainEqual("Johnny");
  }, 1000);

  const updateSarah = {
    name: "Sarah Dawn",
    nickname: "Finer",
  };

  it("should update user with ID 1", async () => {
    const res = await request(app)
      .put("/api/users/1")
      .send(updateSarah)
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should show user with ID 1 (param)", async () => {
    const res = await request(app).get("/api/users/1").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].email).toEqual(Sarah.email.toLowerCase());
    expect(res.body[0].name).toEqual(updateSarah.name);
    expect(res.body[0].nicknames).toContainEqual(updateSarah.nickname);
  }, 1000);

  it("should show user with ID 2 (query)", async () => {
    const res = await request(app).get("/api/users?id=2").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].username).toEqual(John.username);
    expect(res.body[0].email).toEqual(John.email);
  }, 1000);

  it("should show user with username john", async () => {
    const res = await request(app)
      .get("/api/users?username=john")
      .auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].name).toEqual(John.name);
    expect(res.body[0].email).toEqual(John.email);
  }, 1000);

  it("should delete user with ID 2", async () => {
    const res = await request(app).delete("/api/users/2").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should show one user again", async () => {
    const res = await request(app).get("/api/users").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].email).toEqual(Sarah.email.toLowerCase());
    expect(res.body[0].name).toEqual(updateSarah.name);
    expect(res.body[0].nicknames).toContainEqual(updateSarah.nickname);
  }, 1000);

  it("should delete user with ID 1, which is the logged in user", async () => {
    const res = await request(app).delete("/api/users/1").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(200);
  }, 1000);

  it("should not allow access to show users", async () => {
    const res = await request(app).get("/api/users").auth(accessToken, { type: "bearer" });
    expect(res.statusCode).toEqual(401);
  }, 1000);
});
