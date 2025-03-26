import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const argsString = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
    return `${timestamp} ${level}: ${message} ${argsString}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple()
    )
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.json()
    )
  }),
  new winston.transports.File({
    filename: 'logs/all.log',
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.json()
    )
  })
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
}); 