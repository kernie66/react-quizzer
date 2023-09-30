import { Op } from "sequelize";
import { User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import { isEmpty } from "radash";
import { BadRequest } from "../utils/errorHandler.js";

export default async function dbCreateUser(userData) {
  const lowerCaseEmail = userData.email.trim().toLowerCase();
  const allUsers = await User.findAll();
  const firstUser = isEmpty(allUsers);
  const existingUser = JSON.parse(
    JSON.stringify(
      await User.findAll({
        where: {
          [Op.or]: [
            {
              email: lowerCaseEmail,
            },
            { username: userData.username },
          ],
        },
      }),
    ),
  );

  logger.debug("Existing user:", isEmpty(existingUser) ? "No data" : existingUser);

  if (isEmpty(existingUser)) {
    const lastSeen = new Date();
    try {
      const newUser = await User.create({
        name: userData.name,
        email: lowerCaseEmail,
        username: userData.username,
        hashedPassword: userData.hashedPassword,
        lastSeen: lastSeen,
        isAdmin: firstUser,
      });
      if (userData.nicknames) {
        let nicknames = [];
        nicknames.push(userData.nicknames);
        await newUser.update({
          nicknames: nicknames,
        });
      }
      logger.debug("Successfully created user", newUser.username);
      return newUser;
    } catch (error) {
      logger.error("Failed to create user:", error);
      throw new BadRequest(error);
    }
  } else {
    logger.warn("User with same info already exist:", existingUser[0].username);
    throw new BadRequest("User already exists");
  }
}
