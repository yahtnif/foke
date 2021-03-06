<div align="center">
	<div>
		<img width="300" src="https://github.com/yahtnif/static/raw/master/logo/foke.svg?sanitize=true" alt="foke">
	</div>
</div>

[![npm](https://badgen.net/npm/v/foke)](https://www.npmjs.com/package/foke)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

> Simple job queues, with dash server.

## Install

```sh
yarn add foke
# or
npm install foke
```

## Usage

```js
const Foke = require('foke')

// default options
const foke = new Foke({
  // looking for jobs that need to be processed
  interval: '1s', // default: '5s'
  maxRuntime: '1h',
  dash: true, // default: false
  dashLogger: false,
  dashPort: 8641 // http://localhost:8641
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
```

## License

[Anti 996](./LICENSE)
