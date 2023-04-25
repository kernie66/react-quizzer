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
    expect(res.statusCode).toEqual(302);
  });

  /*
  it("should create one user", async () => {
    const userData = {
      name: "Sarah",
      email: "Sarah@example.com",
      username: "sarah",
      password: "sarah",
    };
    const res = await request(app).post("/register").send(userData);
    expect(res.statusCode).toEqual(201);
  });

  it("should login user sarah", async () => {
    const loginData = {
      username: "sarah",
      password: "sarah",
    };
    const res = await request(app).post("/login").send(loginData);
    // console.log(res);
    expect(res.statusCode).toEqual(200);
  });
*/

  it("should create one quiz", async () => {
    const res = await request(app).post("/api/quiz").send(quiz1);
    expect(res.statusCode).toEqual(302);
  }, 1000);

  /*
  it("should show one user", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
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
    expect(res.body.length).toEqual(2);
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

  it("should show user with username john", async () => {
    const res = await request(app).get("/api/users?username=john");
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].name).toEqual("John");
  });

  it("should update user with ID 2", async () => {
    const userData = {
      name: "Sarah Dawn",
      nickname: "Finer",
    };
    const res = await request(app).put("/api/users?id=2").send(userData);
    expect(res.statusCode).toEqual(200);
  });

  it("should delete user with ID 1", async () => {
    const res = await request(app).delete("/api/users?id=1");
    expect(res.statusCode).toEqual(200);
  });

  it("should show one users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(2);
    expect(res.body[0].username).toEqual("sarah");
    expect(res.body[0].email).toEqual("sarah@example.com");
    expect(res.body[0].name).toEqual("Sarah Dawn");
    expect(res.body[0].nicknames).toContainEqual("Finer");
  });
  */

  afterAll(async () => {
    thisDb.close();
  });
});
