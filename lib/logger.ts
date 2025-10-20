import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

// Log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// Transports
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  }),
  
  // File transport for errors
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
  }),
  
  // File transport for all logs
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true,
  }),
  
  // File transport for HTTP requests
  new DailyRotateFile({
    filename: 'logs/http-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'http',
    maxSize: '20m',
    maxFiles: '7d',
    zippedArchive: true,
  }),
]

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  format,
  transports,
})

// Create a stream object with a 'write' function for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}

// Enhanced logging methods
export class Logger {
  private static instance: Logger
  private logger: winston.Logger

  private constructor() {
    this.logger = logger
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  // API request logging
  public logAPIRequest(req: any, res: any, responseTime: number) {
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
    }

    this.logger.info('API Request', logData)
  }

  // API error logging
  public logAPIError(error: Error, req?: any) {
    const logData = {
      message: error.message,
      stack: error.stack,
      url: req?.url,
      method: req?.method,
      ip: req?.ip,
      userId: req?.user?.id,
    }

    this.logger.error('API Error', logData)
  }

  // Security event logging
  public logSecurityEvent(event: string, details: any) {
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      ...details,
    }

    this.logger.warn('Security Event', logData)
  }

  // Performance logging
  public logPerformance(operation: string, duration: number, metadata?: any) {
    const logData = {
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...metadata,
    }

    this.logger.info('Performance', logData)
  }

  // Database operation logging
  public logDatabaseOperation(operation: string, table: string, duration: number, success: boolean) {
    const logData = {
      operation,
      table,
      duration: `${duration}ms`,
      success,
      timestamp: new Date().toISOString(),
    }

    this.logger.info('Database Operation', logData)
  }

  // User action logging
  public logUserAction(userId: string, action: string, details?: any) {
    const logData = {
      userId,
      action,
      timestamp: new Date().toISOString(),
      ...details,
    }

    this.logger.info('User Action', logData)
  }

  // System event logging
  public logSystemEvent(event: string, details?: any) {
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      ...details,
    }

    this.logger.info('System Event', logData)
  }

  // Standard logging methods
  public error(message: string, meta?: any) {
    this.logger.error(message, meta)
  }

  public warn(message: string, meta?: any) {
    this.logger.warn(message, meta)
  }

  public info(message: string, meta?: any) {
    this.logger.info(message, meta)
  }

  public debug(message: string, meta?: any) {
    this.logger.debug(message, meta)
  }

  public http(message: string, meta?: any) {
    this.logger.http(message, meta)
  }
}

// Export singleton instance
export const appLogger = Logger.getInstance()

// Export winston logger for direct use
export default logger
