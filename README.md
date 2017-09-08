leveldb middleware for re-encoding keys or values

### status: EXPERIMENTAL

[![Greenkeeper badge](https://badges.greenkeeper.io/kumavis/level-middleware.svg)](https://greenkeeper.io/)

Using key/value re-encoder
```js
const LevelDown = require('memdown')
const EncoderMiddleware = require('level-middleware')

let MyMiddleware = EncoderMiddleware({
  key: (key, cb) => { ... },
  value: (value, cb) => { ... },
})

let db = MyMiddleware(LevelDown())
```

Per-operation overrides
```js
const LevelDown = require('memdown')
const LevelMiddlewareFactory = require('level-middleware')

let MyMiddleware = LevelMiddlewareFactory({
  get: (key, cb) => { ... },
  put: (key, value, cb) => { ... },
  del: (key, cb) => { ... },
})

let db = MyMiddleware(LevelDown())
```