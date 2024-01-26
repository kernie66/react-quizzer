import { ping } from "../eventsSSE/ping.js";
import { logger } from "../logger/logger.js";
import cron from "node-cron";

export const connectGlobalSSE = async (req, res) => {
  const headers = {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  };
  res.writeHead(200, headers);

  res.write("event: connected\n\n");
  logger.info("Global SSE connected");
  res.write(`data: ${JSON.stringify("Global SSE connected!\n")}`);
  res.write(`id: global\n`);
  res.write("\n\n");

  // If compression middleware is used, then res.flash()
  // must be added to send data to the user
  // res.flush();

  // Send a subsequent message every five seconds
  const pingTask = cron.schedule("*/5 * * * * *", () => {
    ping(res);
  });

  // Close the connection when the client disconnects
  req.on("close", () => {
    pingTask.stop();
    res.end("OK");
    logger.info(`Global SSE connection closed`);
  });
};
