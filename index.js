const async = require('async')

module.exports = MiddlewareFactory

function MiddlewareFactory(opts){
  let putWrapper = opts.put || putNoop
  let getWrapper = opts.get || getNoop
  let delWrapper = opts.del || delNoop
  
  return function DbFactory(db){
    let wrapper = Object.create(db)
    wrapper.put = (key, value, cb) => {
      async.waterfall([
        (cb) => putWrapper(key, value, cb),
        (newKey, newValue, cb) => db.put(newKey, newValue, cb)
      ], cb)
    }
    wrapper.get = (key, cb) => {
      async.waterfall([
        (cb) => getWrapper(key, cb),
        (newKey, cb) => db.get(newKey, cb)
      ], cb)
    }
    wrapper.del = (key, cb) => {
      async.waterfall([
        (cb) => delWrapper(key, cb),
        (newKey, cb) => db.del(newKey, cb)
      ], cb)
    }
    wrapper.batch = (ops, cb) => {
      async.map(ops, (op, next) => {
        switch (op.type) {
          case 'put':
            putWrapper(op.key, op.value, (err, newKey, newValue) => {
              next(null, {
                type: op.type,
                key: newKey,
                value: newValue,
              })
            })
            return
          case 'get':
            getWrapper(op.key, (err, newKey) => {
              next(null, {
                type: op.type,
                key: newKey,
              })
            })
            return
          case 'del':
            delWrapper(op.key, (err, newKey) => {
              next(null, {
                type: op.type,
                key: newKey,
              })
            })
            return
        }
      }, cb)
    }
    return wrapper
  }
}

function getNoop(key, cb){
  cb(null, key)
}
function putNoop(key, value, cb){
  cb(null, key, value)
}
function delNoop(key, cb){
  cb(null, key)
}