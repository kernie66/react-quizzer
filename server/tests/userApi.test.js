import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";
import { John, Sarah } from "./user.data.js";

// const request = supertest();
const thisDb = db;

describe("Test database connection", () => {
  it("should connect to the test database", async () => {
    const res = await testDbConnection();
    expect(res).toBe(true);
  });
});

describe("User API", () => {
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

  it("should show one user", async () => {
    const res = await request(app).get("/api/users").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].name).toEqual(Sarah.name);
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send(John).set("Cookie", session);
    expect(res.statusCode).toEqual(201);
  });

  it("should show two users", async () => {
    const res = await request(app).get("/api/users").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].email).toEqual(Sarah.email.toLowerCase());
    expect(res.body[0].name).toEqual(Sarah.name);
    expect(res.body[1].id).toEqual(2);
    expect(res.body[1].username).toEqual(John.username);
    expect(res.body[1].email).toEqual(John.email);
    expect(res.body[1].name).toEqual(John.name);
    expect(res.body[1].nicknames).toContainEqual("Johnny");
  });

  const updateSarah = {
    name: "Sarah Dawn",
    nickname: "Finer",
  };

  it("should update user with ID 1", async () => {
    const res = await request(app).put("/api/users/1").send(updateSarah).set("Cookie", session);
    expect(res.statusCode).toEqual(200);
  });

  it("should show user with ID 1 (param)", async () => {
    const res = await request(app).get("/api/users/1").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual(Sarah.username);
    expect(res.body[0].email).toEqual(Sarah.email.toLowerCase());
    expect(res.body[0].name).toEqual(updateSarah.name);
    expect(res.body[0].nicknames).toContainEqual(updateSarah.nickname);
  });

  it("should show user with ID 2 (query)", async () => {
    const res = await request(app).get("/api/users?id=2").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].username).toEqual(John.username);
    expect(res.body[0].email).toEqual(John.email);
  });

  it("should show user with username john", async () => {
    const res = await request(app).get("/api/users?username=john").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].name).toEqual(John.name);
    expect(res.body[0].email).toEqual(John.email);
  });

  it("should delete user with ID 1", async () => {
    const res = await request(app).delete("/api/users/1").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
  });

  it("should show one users", async () => {
    const res = await request(app).get("/api/users").set("Cookie", session);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].username).toEqual(John.username);
    expect(res.body[0].email).toEqual(John.email);
    expect(res.body[0].name).toEqual(John.name);
    expect(res.body[0].nicknames).toContainEqual(John.nicknames);
  });

  afterAll(async () => {
    await thisDb.close();
  });
});
