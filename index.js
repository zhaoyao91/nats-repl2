require('checkenv').check()

const logger = require('env-pino')
const repl = require('repl')
const connectMethod = require('nats-method')
const connectEvent = require('nats-event')

const {NATS_URL, METHOD_NATS_URL, EVENT_NATS_URL} = process.env

const method = NATS_URL ? connectMethod(NATS_URL) : connectMethod(METHOD_NATS_URL)
const event = NATS_URL ? connectEvent(NATS_URL) : connectEvent(EVENT_NATS_URL)

method.on('error', err => logger.error(err))
event.on('error', err => logger.error(err))

const {context} = repl.start('> ')
context.method = method
context.event = event
context.logger = logger

// extend: auto log

const {AUTO_LOG} = process.env

if (AUTO_LOG) {
  let callCount = 0

  const originalCall = method.call.bind(method)
  method.call = function (name, input) {
    const id = ++callCount
    setTimeout(() => logger.info({msg: 'method called', id}), 0)
    return originalCall(name, input)
      .then(res => {
        logger.info({msg: 'method returned', id, result: res})
        return res
      })
      .catch(err => {
        logger.error({msg: 'method failed', id, error: err})
      })
  }
}