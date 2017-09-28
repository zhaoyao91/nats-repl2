require('checkenv').check()

const logger = require('simple-json-logger')
const repl = require('repl')
const connectMethod = require('nats-method')
const connectEvent = require('nats-event')
const connectMethodEx = require('nats-method-ex')
const connectEventEx = require('nats-event-ex')
const uuid = require('uuid').v4

const {NATS_URL, METHOD_NATS_URL, EVENT_NATS_URL} = process.env

const {context} = repl.start('> ')
context.method = connectMethod(NATS_URL || METHOD_NATS_URL)
context.event = connectEvent(NATS_URL || EVENT_NATS_URL)
context.methodEx = connectMethodEx(NATS_URL || METHOD_NATS_URL)
context.eventEx = connectEventEx(NATS_URL || EVENT_NATS_URL)

// extend: auto log

const {AUTO_LOG} = process.env

if (AUTO_LOG) {
  const {method, methodEx} = context
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
      const requestId = options.requestId || uuid()
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