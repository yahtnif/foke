<div align="center">
	<div>
		<img width="300" height="150" src="https://github.com/yahtnif/static/raw/master/logo/foke.svg?sanitize=true" alt="foke">
	</div>
</div>

[![npm](https://badgen.net/npm/v/foke)](https://www.npmjs.com/package/foke)
[![996ICU Licence](<https://img.shields.io/badge/license-NPL%20(The%20996%20Prohibited%20License)-blue.svg>)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

> simple job queues.

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
```

## License

[996ICU](./LICENSE)
