const unzipper = require('unzipper')
const stream = require('readable-stream')

function unzip () {
  return unzipper.Parse()
}

function unzipOne(pattern) {
  return unzipper.ParseOne(pattern)
}

class UnzipTransform extends stream.Transform {
  constructor (pattern) {
    super({objectMode:true})

    this.pattern = pattern
  }

  _transform (entry, e, cb) {
    if (this.pattern && entry.path.match(this.pattern) === false) {
      entry.autodrain()
      cb()
      return
    }

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
  unzipOne,
  transform
}
