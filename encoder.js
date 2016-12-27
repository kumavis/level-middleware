const async = require('async')
const MiddlewareFactory = require('./index')

module.exports = EncoderMiddleware

function EncoderMiddleware(opts){
  let mutateKey = opts.key || mutateNoop
  let mutateValue = opts.value || mutateNoop
  return MiddlewareFactory({
    put: (key, value, cb) => {
      asyc.series([
        (cb) => mutateKey(key, cb),
        (cb) => mutateValue(value, cb),
      ], (err, results) => {
        if (err) return cb(err)
        let newKey = results[0]
        let newValue = results[1]
        cb(null, newKey, newValue)
      })
    }
    get: mutateKey,
    del: mutateKey,
  })
}

function mutateNoop(data, cb){
  cb(null, data)
}
