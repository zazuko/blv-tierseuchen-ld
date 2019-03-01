const { Readable } = require('readable-stream')
const eventToPromise = require('barnard59-core/lib/eventToPromise')

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
      return promise.then(() => {
        const next = eventToPromise(pipeline, 'end')
        pipeline.read()
        return promise.then(next)
      })
    }, Promise.resolve())
  };

  static create (...pipelines) {
    return new Sequence(pipelines, this.pipeline)
  }
}

module.exports = Sequence.create
