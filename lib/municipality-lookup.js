const fetch = require('node-fetch')
const rdf = require('rdf-ext')

async function municipalityLookup (quad) {
  if (quad.predicate.value !== 'https://gont.ch/municipality') {
    return quad
  }

  const result = await (await fetch(quad.object.value)).json()

  if ((result.status && result.status === 'error') || result.results.length === 0) {
    console.log(`Lookup for ${quad.subject.value} failed, got: ${JSON.stringify(result)} `)
    return quad
  } else {
    return rdf.quad(quad.subject, quad.predicate, rdf.namedNode(`http://classifications.data.admin.ch/municipality/${result.results[0].id}`))
  }
}

module.exports = municipalityLookup
