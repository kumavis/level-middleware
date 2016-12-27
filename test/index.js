const test = require('tape')
const LevelDown = require('memdown')
const LevelMiddlewareFactory = require('../index')

test('basic tests', function(t){
  t.plan(3)

  let testKey1 = 'test1'
  let testValue1 = 'fruitface'

  function mutateKey(key){
    return `x-${key}-y`
  }

  setupDb({
    put: (key, value, cb) => cb(null, mutateKey(key), value)
  }, function(leveldown, internalDb){

    leveldown.put(testKey1, testValue1, function(err){
      t.notOk(err, 'no error')
      internalDb.get(mutateKey(testKey1), function(err, value){
        t.notOk(err, 'no error')
        t.equal(testValue1, value.toString(), 'value is added at modified key')
      })
    })

  })

})


function setupDb(opts, cb){

  let MyMiddleware = LevelMiddlewareFactory(opts)

  let internalDb = LevelDown()
  let wrappedDb = MyMiddleware(internalDb)

  wrappedDb.open( () => cb(wrappedDb, internalDb) )

}
