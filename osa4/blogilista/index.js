const http = require('http')

const { PORT=3003 } = require('./utils/config.js')
const log = require('./utils/log.js')
const app = require('./app')

const server = http.createServer(app)
server.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`)
})