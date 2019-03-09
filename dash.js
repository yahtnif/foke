const Fastify = require('fastify')
const prettyMs = require('pretty-ms')
const { format } = require('timeago.js')

module.exports = function(foke) {
  const fastify = Fastify({
    logger: foke.options.dashLogger
  })

  fastify.get('/', async (req, reply) => {
    const data = foke.fokes.map(
      ({ name, interval, runCount, runAt, isRunning, spider }) => {
        const waiting = interval - (Date.now() - runAt)
        const data = {
          name,
          runCount,
          isRunning,
          runAt: format(new Date(runAt)),
          interval: prettyMs(interval),
          waiting: !isRunning && runAt && waiting > 0 ? prettyMs(waiting) : 0
        }

        if (spider) {
          data.stats = spider.stats
        }

        return data
      }
    )
    reply.send(JSON.stringify(data, null, 4))
  })

  fastify.listen(foke.options.dashPort, '0.0.0.0', (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
  })
}
