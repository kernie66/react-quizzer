import request from "supertest";
import { app } from "../src/index.js";

// const request = supertest();

describe("User API", () => {
  it("should show all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
  });
});
