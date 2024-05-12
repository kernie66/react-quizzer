import sse from "better-sse";
import { globalChannel } from "../app.js";
import { logger } from "../logger/logger.js";
import { User, Token } from "../../models/index.js";
import { isEmpty } from "radash";
import { clients } from "../app.js";
import { Unauthorized } from "../utils/errorHandler.js";
import { clientsSSE, quizzersSSE } from "../eventsSSE/globalChannelEvents.js";
import { replaceOrAppend } from "radash";

export const connectGlobalSSE = async (req, res, next) => {
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
        return;
      }
      if (user) {
        const tokens = await Token.findAll({ where: { userId: user.id } });
        if (isEmpty(tokens)) {
          throw new Unauthorized("User ID not logged in (SSE)");
        }
      } else {
        next();
        return;
      }
    } catch (error) {
      logger.error("Database query failed (SSE):", error);
      next(error);
      return;
    }

    const clientId = user.id;

    const newClient = {
      id: clientId,
      user: user.dataValues,
      res,
    };

    // Update clients without duplicate users (if logged in multiple times)
    const setClients = replaceOrAppend(clients, newClient, (f) => f.id === newClient.id);
    clients.splice(0, clients.length);
    setClients.map((setClient) => clients.push(setClient));

    const globalSession = await sse.createSession(req, res);
    globalSession.on("disconnected", () => {
      logger.info("Global SSE disconnected event");
    });
    globalChannel.register(globalSession);
    logger.info("Global SSE connected");
    logger.info(`${user.username} - Connection opened`);

    clientsSSE();
    quizzersSSE();

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
      removedClient[0] && logger.info("Removed SSE client for", removedClient[0].user?.username);
      clientsSSE();
      quizzersSSE();

      res.end("OK");
    });
  }
};

export const getClients = (req, res) => {
  logger.debug("Clients:", clients.length);
  res.status(200).json(clients.map((client) => client.user));
};
