require('checkenv').check()

const logger = require('simple-json-logger')
const repl = require('repl')
const connectMethod = require('nats-method')
const connectEvent = require('nats-event')
const connectMethodEx = require('nats-method-ex')

const {NATS_URL, METHOD_NATS_URL, EVENT_NATS_URL} = process.env

const method = NATS_URL ? connectMethod(NATS_URL) : connectMethod(METHOD_NATS_URL)
const event = NATS_URL ? connectEvent(NATS_URL) : connectEvent(EVENT_NATS_URL)
const methodEx = NATS_URL ? connectMethodEx(NATS_URL) : connectMethodEx(METHOD_NATS_URL)

const {context} = repl.start('> ')
context.method = method
context.event = event
context.methodEx = methodEx

// extend: auto log

const {AUTO_LOG} = process.env

if (AUTO_LOG) {
  {
    let callCount = 0

    const originalCall = method.call.bind(method)
    method.call = function (name, input, timeout) {
      const id = ++callCount
      setTimeout(() => logger.info('method called', {id}), 0)
      return originalCall(name, input, timeout)
        .then(res => {
          logger.info('method returned', {id, result: res})
          return res
        })
        .catch(err => {
          logger.error(err, 'method failed', {id})
        })
    }
  }

  {
    const originalCall = methodEx.call.bind(methodEx)
    methodEx.call = function (name, data, options = {}) {
      const requestId = options.requestId || Math.ceil(Math.random() * 1000000)
      setTimeout(() => logger.info('method called', {requestId}), 0)
      return originalCall(name, data, {requestId, ...options})
        .then(res => {
          logger.info('method returned', res)
          return res
        })
        .catch(err => {
          logger.error(err, 'method failed', {requestId})
        })
    }
  }
}