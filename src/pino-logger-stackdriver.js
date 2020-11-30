/*
    Pino Stackdriver logger

    The Pino Logger, but with a format that stackdriver understands

    This will be a package, source code:
    https://bitbucket.org/ponbikedmp/node-logger-stackdriver/src/main/
 */
import pino from 'pino'

const PINO_DEFAULT_LEVEL = 'info'

const PinoLevelToSeverity = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL'
}

const defaultPinoConf = {
  messageKey: 'message',
  formatters: {
    level (label, number) {
      return {
        severity: PinoLevelToSeverity[label] || PinoLevelToSeverity[PINO_DEFAULT_LEVEL],
        level: number
      }
    },
    log (message) {
      return { message }
    }
  }
}

/**
 * Returns a new Pino Logger instance with stackdriver ready logs!
 *
 * @param {object} options
 * @returns {P.Logger} a new Pino logger instance with stackdriver ready logs
 */

export default (options) => pino({ ...options, ...defaultPinoConf })
