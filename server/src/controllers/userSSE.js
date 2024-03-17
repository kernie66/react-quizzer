import { isEmpty } from "radash";
import { Token, User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import { Unauthorized } from "../utils/errorHandler.js";
import { clients } from "../app.js";
import { clientsSSE, quizzersSSE } from "../eventsSSE/initSSE.js";

//let clients = [];

export const connectSSE = async (req, res, next) => {
  let user = null;

  const reqId = req.params?.id;

  if (isNaN(reqId)) {
    logger.debug("No user ID for SSE, ignoring request");
    res.status(204);
    //next();
  } else {
    try {
      if (!isNaN(reqId)) {
        logger.info("User ID (SSE):", reqId);
        const userId = parseInt(reqId);
        if (!isNaN(userId)) {
          user = await User.findByPk(userId, {
            attributes: {
              exclude: ["hashedPassword"],
            },
          });
        }
      } else {
        logger.error("No user ID for SSE");
        res.status(204);
        next();
      }
      if (user) {
        const tokens = await Token.findAll({ where: { userId: user.id } });
        if (isEmpty(tokens)) {
          throw new Unauthorized("User ID not logged in (SSE)");
        }
      } else {
        next();
      }
    } catch (error) {
      logger.error("Database query failed (SSE):", error);
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
    logger.info("SSE connected:", user.username);
    res.write(`data: ${JSON.stringify("You are now connected!\n")}`);
    res.write(`id: ${clientId}\n`);
    res.write("\n\n");

    // If compression middleware is used, then res.flash()
    // must be added to send data to the user
    // res.flush();

    const newClient = {
      id: clientId,
      user: user.dataValues,
      res,
    };

    if (clients.includes(clientId)) {
      console.log("Duplicate client ID:", clientId);
    } else {
      clients.push(newClient);
    }
    logger.debug("Clients:", clients.length);
    clientsSSE();
    quizzersSSE();

    logger.info(`${user.username} - Connection opened`);

    // Close the connection when the client disconnects
    req.on("close", () => {
      logger.info(`${clientId} - Connection closed`);

      const removedClient = clients.filter((client, index, arr) => {
        if (client.id == clientId) {
          arr.splice(index, 1);
          // logger.debug(`Removed client ${client.user.username} with index ${index}`);
          return true;
        }
        return false;
      });
      logger.info("Removed SSE client", removedClient[0].user.username);
      clientsSSE();
      quizzersSSE();

      res.end("OK");
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
    let counter = 1;

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

    */

    // ...
  }
};

export const getClients = (req, res) => {
  logger.debug("Clients:", clients.length);
  res.status(200).json(clients.map((client) => client.user));
};
