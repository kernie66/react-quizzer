import { clients, globalChannel } from "../app.js";
import cron from "node-cron";
import { logger } from "../logger/logger.js";

export const initSSE = () => {
  let counter = 1;

  // Send a subsequent message every five seconds
  const pingTask = cron.schedule("*/5 * * * * *", () => {
    globalChannel.broadcast(counter, "ping");
    logger.debug("Ping (SSE):", counter);
    counter += 1;
  });
};

export const clientsSSE = () => {
  const numberOfClients = clients.length;
  globalChannel.broadcast(numberOfClients, "clients");
  logger.debug("Clients (SSE):", numberOfClients);
};
