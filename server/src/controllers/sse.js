import { User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import { Unauthorized } from "../utils/errorHandler.js";

let clients = [];

export const connectSSE = async (req, res, next) => {
  let user = null;

  logger.info("User ID:", req.params.id);
  try {
    if (req.params.id) {
      const userId = parseInt(req.params.id);
      if (!isNaN(userId)) {
        user = await User.findByPk(userId, {
          attributes: {
            exclude: ["hashedPassword"],
          },
        });
      }
    }
    if (!user) {
      throw new Unauthorized("User not found");
    }
  } catch (error) {
    logger.error("Database query failed:", error);
    next(error);
  }

  const clientId = user.id;

  const headers = {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  };
  res.writeHead(200, headers);

  res.write("event: connected\n\n");
  console.log("SSE connected");
  res.write(`data: ${JSON.stringify("You are now connected!\n")}`);
  res.write(`id: ${clientId}\n`);
  res.write("\n\n");

  // If compression middleware is used, then res.flash()
  // must be added to send data to the user
  // res.flush();

  const newClient = {
    id: clientId,
    res,
  };

  clients.push(newClient);

  console.log(`${user.username} - Connection opened`);

  req.on("close", () => {
    console.log(`${clientId} - Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
  /*
  const sendData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  // Simulate SSE data
  const intervalId = setInterval(() => {
    const message = `Server Time: ${new Date().toLocaleTimeString()}`;
    sendData({ message });
  }, 1000);
  // Close SSE connection when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
  });
*/
  let counter = 0;

  // Send a message on connection
  res.write("event: connected\n\n");
  console.log("SSE connected");
  res.write(`data: ${JSON.stringify("You are now subscribed!\n")}`);
  res.write(`id: ${counter}\n`);
  res.write("\n\n");
  counter += 1;

  // Send a subsequent message every five seconds
  setInterval(() => {
    const data = {
      message: "Connected",
      id: counter,
    };
    res.write("event: ping\n");
    res.write(`data: ${JSON.stringify(data)}\n`);
    res.write(`id: ${counter}\n`);
    res.write("test: just some data\n");
    res.write("\n\n");
    counter += 1;
  }, 5000);

  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));

  // ...
};
