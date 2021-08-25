const config = require('./config.js')

const IS_TEST_ENV = (config.NODE_ENV === 'test')

function info(...args) {
    if (IS_TEST_ENV) { return }
    console.log(...args)
}

function warn(...args) {
    if (IS_TEST_ENV) { return }
    console.warn(...args)
}

function error(...args) {
    if (IS_TEST_ENV) { return }
    console.error(...args)
}

module.exports = {
    info,
    warn,
    error,
}