#!/usr/bin/env node
import normalizePort from "./utils/normalizePort.js";
import { logger } from "./logger/logger.js";
import { app } from "./app.js";
import dbSync from "./db/db.sync.js";
import { Server } from "socket.io";

const apiPort = normalizePort(process.env.PORT || "3000");

let server = app.listen(apiPort, () => {
  try {
    dbSync(false);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Connection to database failed:", error);
  }
  logger.info(`Server running on port ${apiPort}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("on connection", socket.id);
  socket.on("ding", (ding) => {
    console.log(ding);
    socket.emit("update_user", { key: "value" });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket.on("userChat", (data) => {
    console.log(data);
  });
});
