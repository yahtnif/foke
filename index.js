const ms = require('ms')
const { Hash } = require('suni')
const log = require('debug')('foke')
const dash = require('./dash')

const defaultFokeOptions = {
  // maxRuntime: '1h',
  interval: '1m',
  priority: 0,
  runCount: 0
}

const defaultOptions = {
  maxRuntime: '1h',
  interval: '5s',
  dash: false,
  dashLogger: false,
  dashPort: 8641
}

class Foke {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options }
    this.interval = this.toMillisecond(this.options.interval)
    this.maxRuntime = this.toMillisecond(this.options.maxRuntime)
    this.fokes = []
    this.isRunning = {}
    this.runningInterval = null
  }

  toMillisecond(value) {
    return value ? (typeof value === 'number' ? value : ms(value)) : value
  }

  getFokeIndex(foke) {
    return this.fokes.findIndex(v => v.name === foke.name)
  }

  updateFoke(action, foke) {
    if (Array.isArray(foke)) {
      foke.forEach(t => {
        this.updateFoke(action, t)
      })
      return
    }

    const actionName = action + 'Foke'
    this[actionName](foke)
  }

  add(foke) {
    this.updateFoke('add', foke)
  }

  addFoke(foke) {
    if (this.getFokeIndex(foke) > -1) return

    const newFoke = {
      ...defaultFokeOptions,
      ...foke
    }

    if (newFoke.interval) {
      newFoke.interval = this.toMillisecond(newFoke.interval)
    }

    if (newFoke.maxRuntime) {
      newFoke.maxRuntime = this.toMillisecond(newFoke.maxRuntime)
    }

    log('Add foke:', foke.name)
    this.fokes.push(newFoke)
    this.fokes.sort((a, b) => b.priority - a.priority)
  }

  remove(foke) {
    this.updateFoke('remove', foke)
  }

  removeFoke(foke) {
    const index = this.getFokeIndex(foke)
    if (index > -1) {
      log('Remove foke:', foke.name)
      this.fokes.splice(index, 1)
    }
  }

  runUnique(action) {
    const actionId = Hash.md5(action)

    if (this.isRunning[actionId]) return

    const todo = async () => {
      this.isRunning[actionId] = true

      await action()

      this.isRunning[actionId] = false
    }

    todo()
  }

  async runFoke(foke) {
    foke.isRunning = true

    const thisRunAt = Date.now()

    foke.runAt = thisRunAt
    foke.runCount++

    log('Start foke:', foke.name)
    // TODO action MUST be promise
    await foke.action(foke)
    log('Finish foke:', foke.name)

    if (foke.runAt === thisRunAt) {
      foke.isRunning = false
    }
  }

  checkFokes() {
    this.runUnique(async () => {
      const execFokes = this.fokes.filter(foke => {
        const runTime = Date.now() - foke.runAt
        const canRun =
          (!foke.isRunning &&
            (foke.runCount === 0 || runTime > foke.interval)) ||
          runTime > (foke.maxRuntime || this.maxRuntime)

        return canRun
      })

      for (let foke of execFokes) {
        this.runFoke(foke)
      }
    })
  }

  start() {
    this.checkFokes()

    this.runningInterval = setInterval(() => {
      this.checkFokes()
    }, this.interval)

    if (this.options.dash) {
      dash(this)
    }
  }

  stop() {
    clearInterval(this.runningInterval)
  }
}

module.exports = Foke
module.exports.default = Foke
