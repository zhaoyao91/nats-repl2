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