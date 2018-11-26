const unzipper = require('unzipper')
const stream = require('readable-stream')

function unzip () {
  return unzipper.Parse()
}

class UnzipTransform extends stream.Transform {
  constructor () {
    super({objectMode:true})
  }

  _transform (entry, e, cb) {
    if (!entry.path.match(/^Stammdaten_s/)) {
      entry.autodrain()
      cb()
      return
    }

    console.log(entry.path)
    entry.on('data', (chunk) => {
      this.push(chunk)
    })
      .on('finish', cb)
  }
}


function transform(pattern) {
  return new UnzipTransform(pattern)
}

module.exports = {
  unzip,
  transform
}
