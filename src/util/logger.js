/* @flow */
import winston from 'winston'

export type LevelType = 'error' | 'warn' | 'info'

class Logger {
  innerLogger: winston

  constructor () {
    this.innerLogger = winston.createLogger()
    this.configure({
      transports: [
        new winston.transports.Console({ colorize: true })
      ]
    })
  }

  configure (options: Object) {
    this.innerLogger.configure(options)
  }

  mute () {
    this.configure({ transports: [] })
  }

  log (level: LevelType, info: any, extra?: any) {
    this.innerLogger.log(level, info, extra)
  }

  error (info: any, extra?: any) {
    this.log('error', info, extra)
  }

  warn (info: any, extra?: any) {
    this.log('warn', info, extra)
  }

  info (info: any, extra?: any) {
    this.log('info', info, extra)
  }
}

export default new Logger()
