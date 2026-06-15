import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${String(timestamp)}] [${String(level).toUpperCase()}] ${String(message)}${extra}`;
  }),
);

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Consola (siempre)
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),

    // Archivo rotativo — un .txt por día en Backend/logs/
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'animai-%DATE%.txt',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d', // conserva los últimos 7 días
      level: 'info',
      format: logFormat,
    }),

    // Archivo separado solo para errores
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'animai-error-%DATE%.txt',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      level: 'error',
      format: logFormat,
    }),
  ],
};
