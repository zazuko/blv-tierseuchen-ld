const fetch = require('node-fetch')
const rdf = require('rdf-ext')

async function municipalityLookup (quad) {
  if (quad.predicate.value !== 'https://gont.ch/municipality') {
    return quad
  }

  const result = await (await fetch(quad.object.value)).json()

  return rdf.quad(quad.subject, quad.predicate, rdf.namedNode(`http://classifications.data.admin.ch/municipality/${result.results[0].id}`))
}

module.exports = municipalityLookup
