const Foke = require('./index')

// default options
const foke = new Foke({
  // looking for jobs that need to be processed
  interval: '1s', // default: '5s'
  maxRuntime: '1h',
  dash: true, // default: false
  dashLogger: false,
  dashPort: 8641
})

let i = 0

foke.add({
  name: 'test',
  // lock lifetime
  maxRuntime: '1h',
  interval: '2s', // default: '1m'
  priority: 0,
  action() {
    console.log(new Date())
    if (i++ > 3) {
      foke.stop()
      console.log('DONE')
    }
  }
})

foke.start()
