const through = require('through2')
const run = require('barnard59-core').run
const Pipeline = require('barnard59-core').pipeline

module.exports = function (pipeline) {
  return through.obj(function (chunk, encoding, callback) {

    const next = Pipeline(pipeline.node._context[0].dataset, {
      iri: pipeline.node.term,
      basePath: pipeline.basePath,
      context: pipeline.context,
      variables: pipeline.variables
    })

    console.log(chunk)
    next.variables.set('csv', chunk)

    run(next.pipe(this)).then(() => {
      debugger
      return callback()
    }).catch(() => {
      debugger
      return callback()
    })
  })
}
