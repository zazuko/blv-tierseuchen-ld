const Readable = require('readable-stream').Readable
const run = require('barnard59-core').run

class Sequence extends Readable {
  constructor (pipelines, parent) {
    super({ objectMode: true })

    this.pipelines = pipelines
    this.parent = parent
  }

  _read () {
    this.runPipelines().catch(err => this.emit('error', err))
  }

  runPipelines () {
    return this.pipelines.reduce((promise, pipeline) => {
      const clone = pipeline.clone({ ...this.parent, objectMode: true })

      return promise.then(() => clone.init().then(() => run(clone.streams[0])))
    }, Promise.resolve())
  };

  static create (...pipelines) {
    return new Sequence(pipelines, this.pipeline)
  }
}

module.exports = Sequence.create
