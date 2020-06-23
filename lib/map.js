const transform = require('parallel-transform')

function map (func) {
  return transform(100, { ordered: false }, (data, callback) => {
    Promise.resolve().then(() => {
      return func.call(this, data)
    }).then((result) => {
      callback(null, result)
    }).catch(callback)
  })
}

module.exports = map
