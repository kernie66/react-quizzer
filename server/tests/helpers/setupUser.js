import request from "supertest";

export default async function setupUser(app, thisDb, user) {
  if (thisDb) {
    const status = await thisDb.sync({ force: true });
    expect(status.config.database).toEqual("quizzer_test");
  }
  let res = await request(app).post("/register").send(user);
  expect(res.statusCode).toEqual(201);

  res = await request(app).post("/login").send(user);
  const accessToken = res.body.accessToken;
  console.log(accessToken);
  expect(res.statusCode).toEqual(200);
  return accessToken;
}
