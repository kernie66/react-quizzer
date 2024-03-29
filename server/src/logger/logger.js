import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import pkg from "winston-format-pretty-console";
import { emailOptions } from "../utils/sendEmail.js";
import Mail from "winston-mail-lite";

const prettyConsoleFormat = pkg;

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/quizzer-rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const transportOptions = emailOptions;
const messageOptions = {
  from: '"Quizzer Admin" <admin@kernie.net>',
  to: '"Quizzer Admin" <admin@kernie.net>',
  subject: "Quizzer Winston logger",
};
const emailTransport = new Mail({
  transportOptions: transportOptions,
  messageOptions: messageOptions,
});

export const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: "Quizzer" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({
      filename: "logs/quizzer-error.log",
      level: "error",
    }),
    // new transports.File({ filename: 'logs/quizzer-combined.log' }),
    fileRotateTransport,
    //    emailTransport,
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/quizzer-exceptions.log" }),
    emailTransport,
  ],
  rejectionHandlers: [new transports.File({ filename: "logs/quizzer-rejections.log" })],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.metadata({
          fillExcept: ["message", "level", "timestamp", "label", "service"],
        }),
        prettyConsoleFormat(),
        //        logFormat
      ), // colorize(), format.simple()),
    }),
  );
}
