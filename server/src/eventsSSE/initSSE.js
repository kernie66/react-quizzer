import { clients, globalChannel } from "../app.js";
import cron from "node-cron";
import { logger } from "../logger/logger.js";
import { select } from "radash";

export const initSSE = () => {
  let counter = 1;

  // Send a subsequent message every five seconds
  const pingTask = cron.schedule("*/5 * * * * *", () => {
    globalChannel.broadcast(counter, "ping");
    // logger.debug("Ping (SSE):", counter);
    counter += 1;
  });

  globalChannel
    .on("session-registered", (session) => {
      logger.debug("Added connected session, count:", globalChannel.sessionCount);
      logger.info("Connected client hostname", session.req.hostname);
    })
    .on("session-deregistered", () => {
      logger.debug("Removed connected session, count:", globalChannel.sessionCount);
    });
};

export const clientsSSE = () => {
  const numberOfClients = clients.length;
  globalChannel.broadcast(numberOfClients, "clients");
  logger.debug("Clients (SSE):", numberOfClients);
};

export const quizzersSSE = () => {
  const quizzers = select(
    clients,
    (c) => c.id,
    (c) => c.user.quizMasterId === null,
  );
  const quizMaster = select(
    clients,
    (c) => c.id,
    (c) => c.user.quizMasterId !== null,
  );
  const quizzerIds = { quizMaster, quizzers }; // fork(clients, (q) => q.user.quizMasterId === null);
  logger.debug("Quizzers (SSE):", quizzerIds);
  globalChannel.broadcast(quizzerIds, "quizzers");
};
