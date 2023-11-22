import * as log4js from 'log4js'
import * as path from 'path'
import {cwd} from 'process'

const appenders = {
  ssvValidator: {type: 'file', filename: path.join(cwd(), 'logs', 'ssvValidator.log'), maxLogSize: 10 * 1000 * 1000},
  ssvBalance: {type: 'file', filename: path.join(cwd(), 'logs', 'ssvBalance.log'), maxLogSize: 10 * 1000 * 1000},
}
const categories = {
  default: {appenders: ['ssvValidator'], level: 'info'},
  ssvValidator: {appenders: ['ssvValidator'], level: 'info'},
  ssvBalance: {appenders: ['ssvBalance'], level: 'info'}
}

log4js.configure({appenders, categories})

const ssvValidatorLogger = log4js.getLogger('ssvValidator')
const ssvBalanceLogger = log4js.getLogger('ssvBalance')

export {
  ssvValidatorLogger,
  ssvBalanceLogger
}
