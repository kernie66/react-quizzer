import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import pkg from 'winston-format-pretty-console';

const prettyConsoleFormat = pkg;

const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/quizzer-rotate-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'Quizzer' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({
      filename: 'logs/quizzer-error.log',
      level: 'error',
    }),
    // new transports.File({ filename: 'logs/quizzer-combined.log' }),
    fileRotateTransport,
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/quizzer-exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/quizzer-rejections.log' }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.metadata({
          fillExcept: [
            'message',
            'level',
            'timestamp',
            'label',
            'service',
          ],
        }),
        prettyConsoleFormat()
        //        logFormat
      ), // colorize(), format.simple()),
    })
  );
}
