import request from "supertest";
import { app } from "../src/app.js";
import { db, testDbConnection } from "../src/db/db.config.js";

// const request = supertest();
const thisDb = db;

describe("Test database connection", () => {
  it("should connect to the test database", async () => {
    const res = await testDbConnection();
    expect(res).toBe(true);
  });
});

describe("User API", () => {
  beforeAll(async () => {
    await thisDb.sync({ force: true });
  });

  it("should create one user", async () => {
    const userData = {
      name: "John",
      email: "john@example.com",
      username: "john",
      nicknames: "Johnny",
    };
    const res = await request(app).post("/api/users").send(userData);
    expect(res.statusCode).toEqual(201);
  });

  it("should show one user", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual("john");
    expect(res.body[0].name).toEqual("John");
    expect(res.body[0].nicknames).toContainEqual("Johnny");
  });

  it("should create another user", async () => {
    const userData = {
      name: "Sarah",
      email: "Sarah@example.com",
      username: "sarah",
    };
    const res = await request(app).post("/api/users").send(userData);
    expect(res.statusCode).toEqual(201);
  });

  it("should show two users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].username).toEqual("john");
    expect(res.body[0].email).toEqual("john@example.com");
    expect(res.body[1].id).toEqual(2);
    expect(res.body[1].username).toEqual("sarah");
    expect(res.body[1].email).toEqual("sarah@example.com");
  });

  it("should show user with ID 2", async () => {
    const res = await request(app).get("/api/users?id=2");
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].username).toEqual("sarah");
    expect(res.body[0].email).toEqual("sarah@example.com");
  });

  it("should update user with ID 2", async () => {
    const userData = {
      name: "Sarah Dawn",
      nickname: "Finer",
    };
    const res = await request(app).put("/api/users?id=2").send(userData);
    expect(res.statusCode).toEqual(200);
  });

  afterAll(async () => {
    thisDb.close();
  });
});
